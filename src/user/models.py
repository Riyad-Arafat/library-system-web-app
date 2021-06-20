from django.db import models
from django.db.models.fields import *
from django.db.models.fields.related import *

from django.utils import timezone


from book.models import Book
# Create your models here.


class User(models.Model):
    ROLES = [
        ('USER', 'USER'),
        ('ADMIN', 'ADMIN'),
    ]
    firstName = CharField(max_length=50)
    lastName = CharField(max_length=50)
    email = EmailField(verbose_name="email", unique=True)
    password = CharField(max_length=250)
    token = CharField(max_length=500, unique=True)
    role = CharField(
        max_length=10, choices=ROLES, null=True, blank=True, default="USER")

    books = ManyToManyField(
        Book, related_name='users', blank=True, default=None)

    created_at = DateTimeField(default=timezone.now)
    update_at = DateTimeField(auto_now=True)


def __str__(self):
    return self.firstName + " " + self.lastName
