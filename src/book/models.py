from django.db import models
from django.db.models.fields.related import *
from django.db.models.fields import *

from django.utils import timezone

# Create your models here.


class Category(models.Model):

    tilte = CharField(max_length=200)
    created_at = DateTimeField(default=timezone.now)
    update_at = DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


# ////////////////// ################## ////////////////

class Author (models.Model):
    firstName = CharField(max_length=50)
    lastName = CharField(max_length=50)
    created_at = DateTimeField(default=timezone.now)
    update_at = DateTimeField(auto_now=True)

    def __str__(self):
        return self.firstName + " " + self.lastName


class Book(models.Model):

    title = CharField(max_length=200)
    author = ForeignKey(
        Author, on_delete=models.CASCADE, related_name='author', blank=True, null=True)
    category = ManyToManyField(
        Category, related_name='Category', default=None, blank=True)
    created_at = DateTimeField(default=timezone.now)
    update_at = DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
