from django.core import serializers
from django.db.models import fields
from django.views.generic.edit import CreateView
# from django.shortcuts import render
from django.http import JsonResponse
import json
import bcrypt
import uuid
from user.models import User
# Create your views here.


class Signup(CreateView):

    def post(self, request):
        if request.method == 'POST':
            body = json.loads(request.body)
            firstName = body["firstName"]
            lastName = body["lastName"]
            email = body["email"]
            password = body["password"].encode('utf8')
            data = {"satusCode": 200}
            hashed = bcrypt.hashpw(password, bcrypt.gensalt()).decode()
            token = str(uuid.uuid4())
            try:

                user = User.objects.create(
                    firstName=firstName, lastName=lastName, email=email, password=hashed, token=token)
                user.save()

            except:
                data = {"satusCode": 400}
            return JsonResponse(data, safe=False)
        else:
            return JsonResponse({"satusCode": 404}, safe=False)

    def get(self, request):
        return JsonResponse({"satusCode": 404}, safe=False)


class Login(CreateView):

    def post(self, request):
        if request.method == 'POST':
            body = json.loads(request.body)

            email = body["email"]
            password = body["password"].encode('utf8')

            user = User.objects.filter(email=email).values(
                "password", "token")

            data = list(user)
            data = json.loads(json.dumps(data[0]))

            if bcrypt.checkpw(password, data["password"].encode("utf8")):
                del data["password"]
                response = {"data": data}

            else:
                data = {"satusCode": 400}

            response = {"data": data}

            return JsonResponse(response, safe=False)
        else:
            return JsonResponse({"satusCode": 404}, safe=False)

    def get(self, request):
        return JsonResponse({"satusCode": 404}, safe=False)
