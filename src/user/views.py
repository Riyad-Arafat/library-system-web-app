from django.views.generic.edit import CreateView
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

            data = {"satusCode": 200}
            try:

                firstName = body["firstName"]
                lastName = body["lastName"]
                email = body["email"]
                password = body["password"].encode('utf8')
                hashed = bcrypt.hashpw(password, bcrypt.gensalt()).decode()
                token = str(uuid.uuid4())

                if(len(email) < 10 or len(password) < 8 or firstName == "" or lastName == ""):
                    data = {"satusCode": 400}

                else:
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
            response = {"satusCode": 200}
            try:
                email = body["email"]
                password = body["password"].encode('utf8')

                user = User.objects.filter(email=email).values(
                    "password", "token", "role")

                data = list(user)
                data = json.loads(json.dumps(data[0]))

                if bcrypt.checkpw(password, data["password"].encode("utf8")):
                    del data["password"]
                    response = {"data": data, "satusCode": 200}
                else:
                    response = {"satusCode": 400}

            except:
                response = {"satusCode": 400}

            return JsonResponse(response, safe=False)

        else:
            return JsonResponse({"satusCode": 404}, safe=False)

    def get(self, request):
        return JsonResponse({"satusCode": 404}, safe=False)
