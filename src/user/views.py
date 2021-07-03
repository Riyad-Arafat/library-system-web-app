from django.views.generic.edit import CreateView
from django.http import JsonResponse
import json
import bcrypt
import uuid
from user.models import User
from django.core import serializers

# Create your views here.


class Signup(CreateView):

    def post(self, request):

        body = json.loads(request.body)
        data = {}

        try:

            firstName = body["firstName"]
            lastName = body["lastName"]
            email = body["email"]
            password = body["password"].encode('utf8')
            hashed = bcrypt.hashpw(password, bcrypt.gensalt()).decode()
            token = str(uuid.uuid4())

            if(len(email) < 10 or len(password) < 8 or firstName == "" or lastName == ""):
                raise Exception("wrong Info")

            else:
                user = User.objects.create(
                    firstName=firstName, lastName=lastName, email=email, password=hashed, token=token)
                user.save()

        except:
            response = JsonResponse([], safe=False)
            response.status_code = 400
            return response
        return JsonResponse(data, safe=False)


class Login(CreateView):

    def post(self, request):

        body = json.loads(request.body)
        data = {}
        try:
            email = body["email"]
            password = body["password"].encode('utf8')

            user = User.objects.filter(email=email).values(
                "password", "token", "role")

            data = list(user)
            data = json.loads(json.dumps(data[0]))

            if bcrypt.checkpw(password, data["password"].encode("utf8")):
                del data["password"]
                data = {"data": data}
            else:
                raise Exception("password is wrong")

        except Exception as e:
            print(e)
            response = JsonResponse([], safe=False)
            response.status_code = 400
            return response

        return JsonResponse(data, safe=False)


class UserClass(CreateView):

    def post(self, request):

        Bearer = request.headers.get('Authorization') or ""

        token = Bearer.split("Bearer ")[1] or ""

        try:
            json_data = serializers.serialize(
                "json", User.objects.filter(token=token))

            data = json.loads(json_data)
            data = data[0]["fields"]

        except Exception as e:
            print(e)
            response = JsonResponse([], safe=False)
            response.status_code = 400
            return response

        return JsonResponse(data, safe=False)

    def put(self, request):

        body = json.loads(request.body)
        data = {}

        try:

            firstName = body["firstName"]
            lastName = body["lastName"]
            email = body["email"]

            if(len(email) < 10 or firstName == "" or lastName == ""):
                raise Exception("wrong Info")

            Bearer = request.headers.get('Authorization') or ""

            token = Bearer.split("Bearer ")[1] or ""

            user = User.objects.filter(token=token)
            user = user[0]
            if(user.role != "ADMIN" or token == user.token):
                user.firstName = firstName
                user.lastName = lastName
                user.email = email
                user.save()
            else:
                raise Exception("4001")

        except Exception as e:
            print(e)
            response = JsonResponse([], safe=False)
            response.status_code = 400
            return response
        return JsonResponse(data, safe=False)
