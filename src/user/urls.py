
from django.urls import path
from .views import *
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('auth/signup/',  csrf_exempt(Signup.as_view()), name="singup"),
    path('auth/login/',  csrf_exempt(Login.as_view()), name="login"),
    path('auth/me/',  csrf_exempt(UserClass.as_view()), name="user"),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
