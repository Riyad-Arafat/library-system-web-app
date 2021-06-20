import json
from django.core.checks.messages import Error
from django.http import JsonResponse
from django.views.generic.edit import CreateView

from .models import Book as BookModel
from user.models import User


class Books(CreateView):

    def get(self, request):
        data = []
        try:
            books = BookModel.objects.all().values("id", "title", "author",  "category", "isbn", "pYear", "borrowed_books",
                                                   "created_at",  "update_at")
            data = list(books)

        except Exception as e:
            print(e)
            response = JsonResponse([], safe=False)
            response.status_code = 400
            return response

        return JsonResponse({"data": data}, safe=False)

    def post(self, request):
        if request.method == 'POST':
            body = json.loads(request.body)
            data = {}
            try:

                title = body["title"]
                author = body["author"]
                category = body["category"]
                isbn = body["isbn"]
                pYear = body["pYear"]
                pYear = int(pYear)

                book = BookModel.objects.create(
                    title=title, category=category, author=author, isbn=isbn, pYear=pYear)
                book.save()
            except Exception as e:
                print(e)
                response = JsonResponse([], safe=False)
                response.status_code = 400
                return response

            return JsonResponse({"data": data}, safe=False)


class Book(CreateView):

    def get(self, request, task=None, id=None):
        if (task and task == "add"):
            response = JsonResponse([], safe=False)
            response.status_code = 200

            token = request.headers.get('Authorization')
            token = token.split("Bearer ")[1]
            try:

                user = User.objects.filter(token=token)

                book = BookModel.objects.filter(pk=id)
                if(user):
                    user[0].borrowed_book.add(book[0].pk)
                    user[0].save()
                else:
                    raise NameError(f"Unauthorized token {token}")

            except Exception as e:
                print(e)
                response = JsonResponse([], safe=False)
                response.status_code = 401

            return response
        else:
            data = []
            if(id):
                try:
                    book = BookModel.objects.filter(id=id).values("id", "title", "author",  "category", "isbn", "pYear", "borrowed_books",
                                                                  "created_at",  "update_at")

                    data = list(book)
                    data = data[0]

                except Exception as e:
                    print(e)
                    response = JsonResponse([], safe=False)
                    response.status_code = 400
                    return response
            return JsonResponse({"data": data}, safe=False)
