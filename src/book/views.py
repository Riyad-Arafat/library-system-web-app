import json
from django.http import JsonResponse
from django.views.generic.edit import CreateView

from .models import Book as BookModel
from user.models import User

from django.db.models import Q
# UTILIS


class Books(CreateView):

    def get(self, request, task=None, query=None):
        if task is None and query is None:
            data = []
            try:
                books = BookModel.objects.filter(~Q(amount=0)).values("id", "title", "author",  "category", "isbn", "pYear", 'amount', "users",
                                                                      "created_at",  "update_at").order_by('-created_at')
                data = list(books)

            except Exception as e:
                print(e)
                response = JsonResponse([], safe=False)
                response.status_code = 400
                return response

            return JsonResponse({"data": data}, safe=False)
        elif(task == "search" and query is not None):
            data = []
            try:
                books = BookModel.objects.filter(~Q(amount=0) & Q(title__contains=query) | Q(author__contains=query)).values("id", "title", "author",  "category", "isbn", "pYear", 'amount', "users",
                                                                                                                             "created_at",  "update_at").order_by('-created_at')
                data = list(books)
            except Exception as e:
                print(e)
                response = JsonResponse([], safe=False)
                response.status_code = 400
                return response

            return JsonResponse({"data": data}, safe=False)

    # CREATE BOOK
    def post(self, request):

        body = json.loads(request.body)
        print(body)

        try:

            title = body["title"]
            author = body["author"]
            category = body["category"]
            isbn = body["isbn"]
            pYear = body["pYear"]
            amount = body["amount"]

            pYear = int(pYear)
            amount = int(amount)

            book = BookModel.objects.create(
                title=title, category=category, author=author, isbn=isbn, pYear=pYear, amount=amount)
            book.save()

        except Exception as e:
            print(e)
            response = JsonResponse([], safe=False)
            response.status_code = 400
            return response

        return JsonResponse({}, safe=False)


class Book(CreateView):

    def post(self, request, task=None, id=None):
        if (task and task == "add"):
            response = JsonResponse([], safe=False)
            response.status_code = 200

            token = request.headers.get('Authorization')
            token = token.split("Bearer ")[1]
            try:

                user = User.objects.filter(token=token)
                user = user[0]
                book = BookModel.objects.filter(pk=id)
                book = book[0]
                if(user and book.amount > 0):
                    user.books.add(book.pk)
                    user.save()
                    book.amount -= 1
                    book.save()
                else:
                    print(
                        f"Sold All Amount for book OR Unauthorized token {token}")
                    response = JsonResponse([], safe=False)
                    response.status_code = 400

            except Exception as e:
                print(e)
                response = JsonResponse([], safe=False)
                response.status_code = 401

            return response

    # UPDATE BOOK

    def put(self, request, task=None, id=None):
        if request.method == 'PUT' and task == None and id is not None:
            body = json.loads(request.body)
            data = {}
            try:
                title = body["title"]
                author = body["author"]
                category = body["category"]
                isbn = body["isbn"]
                pYear = body["pYear"]
                amount = body["amount"]

                pYear = int(pYear)
                amount = int(amount)

                book = BookModel.objects.filter(id=id)
                book = book[0]
                book.title = title
                book.category = category
                book.author = author
                book.isbn = isbn
                book.pYear = pYear
                book.amount = amount
                book.save()
            except Exception as e:
                print(e)
                response = JsonResponse([], safe=False)
                response.status_code = 400
                return response

            return JsonResponse({"data": data}, safe=False)

    def get(self, request, id=None):
        if(id):
            try:
                book = BookModel.objects.filter(id=id).values("id", "title", "author",  "category", "isbn", "pYear", "amount", "users",
                                                              "created_at",  "update_at")

                data = book
                print(data)
                data = data[0]

            except Exception as e:
                print(e)
                response = JsonResponse([], safe=False)
                response.status_code = 400
                return response
        return JsonResponse({"data": data}, safe=False)
