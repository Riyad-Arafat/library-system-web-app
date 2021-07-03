import json
from django.http import JsonResponse
from django.views.generic.edit import CreateView

from .models import Book as BookModel
from user.models import User

from django.db.models import Q


# # # # # # # # # # # UTILIS #

def isAuthenticated(Bearer):
    token = Bearer.split("Bearer ")[1] or ""
    try:
        # ///// Auth
        user = User.objects.filter(token=token)
        user = user[0]
        return True
    except Exception:
        return False


def isAdmin(Bearer):
    if(isAuthenticated(Bearer)):
        token = Bearer.split("Bearer ")[1] or ""
        try:
            # ///// Auth
            user = User.objects.filter(token=token)
            user = user[0]
            if(user.role == "ADMIN"):
                return True
            else:
                return False
        except Exception:
            return False
    else:
        return False

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


class Books(CreateView):

    def get(self, request, task=None, query=None):

        token = request.headers.get('Authorization') or ""

        if task is None and query is None:
            data = []
            try:
                if(not isAuthenticated(token)):
                    raise Exception("Invalid Token")
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
                if(not isAuthenticated(token)):
                    raise Exception("Invalid Token")
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

        token = request.headers.get('Authorization') or ""

        try:

            if(isAdmin(token)):
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
            else:
                raise Exception("User is Not ADMIN")

        except Exception as e:
            print(e)
            response = JsonResponse([], safe=False)
            response.status_code = 400
            return response

        return JsonResponse({}, safe=False)


class Book(CreateView):

    def post(self, request, task=None, id=None):

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
                if task == "delete" and book in user.books.all():
                    user.books.remove(book)
                    book.amount += 1
                elif task == "add" and book not in user.books.all():
                    user.books.add(book)
                    book.amount -= 1

                book.save()
                user.save()

            else:
                raise Exception(
                    f"Sold All Amount for book OR Unauthorized token {token}")

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

            token = request.headers.get('Authorization') or ""

            try:
                if(isAdmin(token)):
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
                else:
                    raise Exception("User is Not ADMIN")
            except Exception as e:
                print(e)
                response = JsonResponse([], safe=False)
                response.status_code = 400
                return response

            return JsonResponse({"data": data}, safe=False)

    def get(self, request, id=None):
        if(id):
            token = request.headers.get('Authorization') or ""
            try:
                if(isAuthenticated(token)):
                    book = BookModel.objects.filter(id=id)
                    users = book[0].users.all().values("token")

                    data = book.values("id", "title", "author",  "category", "isbn", "pYear", "amount",
                                                                             "created_at",  "update_at")
                    data = data[0]
                    data["users"] = list(users)

                else:
                    raise Exception("Invalied Token")

            except Exception as e:
                print(e)
                response = JsonResponse([], safe=False)
                response.status_code = 400
                return response
        return JsonResponse({"data": data}, safe=False)
