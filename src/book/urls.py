
from django.urls import path
from .views import *
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('books/',  csrf_exempt(Books.as_view()), name="get_all_books"),
    path('book/<int:id>/',  csrf_exempt(Book.as_view()), name="book"),
    path('book/<task>/<int:id>',  csrf_exempt(Book.as_view()), name="book"),




]
