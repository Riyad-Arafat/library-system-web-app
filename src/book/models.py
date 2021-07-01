from django.db import models
from django.db.models.fields.related import *
from django.db.models.fields import *

from django.utils import timezone


import datetime
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

# Create your models here.


########  UTILS #######

def current_year():
    return datetime.date.today().year


def max_value_current_year(value):
    return MaxValueValidator(current_year())(value)


class Book(models.Model):

    title = CharField(max_length=200)
    author = CharField(max_length=200)
    category = CharField(max_length=200)
    isbn = CharField(max_length=200)
    pYear = PositiveIntegerField(
        default=current_year(), validators=[MinValueValidator(1900), max_value_current_year])
    amount = IntegerField()
    created_at = DateTimeField(default=timezone.now)
    update_at = DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
