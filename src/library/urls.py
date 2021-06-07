from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('auth/', include('user.urls')),
    path('admin/', admin.site.urls),


]


# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# handler404 = 'posts.views.error_404_view'
