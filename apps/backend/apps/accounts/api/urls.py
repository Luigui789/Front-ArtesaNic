from django.urls import path

from . import views

app_name = "accounts"

urlpatterns = [
    path("csrf/", views.CSRFView.as_view(), name="csrf"),
    path("registro/comprador/", views.RegistroCompradorView.as_view(), name="registro-comprador"),
    path("registro/artesano/", views.RegistroArtesanoView.as_view(), name="registro-artesano"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("refrescar/", views.RefrescarView.as_view(), name="refrescar"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("perfil/", views.PerfilView.as_view(), name="perfil"),
]
