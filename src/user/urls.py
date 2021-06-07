
from django.urls import path
from .views import *
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('signup/',  csrf_exempt(Signup.as_view()), name="singup"),
    path('login/',  csrf_exempt(Login.as_view()), name="login"),


]
