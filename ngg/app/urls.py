from django.urls import path, include
from rest_framework import routers
from .views import (
    TpersonViewSet,
    TpipesViewSet,
    TableListView,
    TableContentView,
    HiddenViewSet,
)


router = routers.DefaultRouter()
router.register("person", TpersonViewSet, basename="person")
router.register("pipe", TpipesViewSet)
router.register("table", TableListView, basename="table")
router.register("hidden", HiddenViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path(
        "table-content/<str:table_name>/",
        TableContentView.as_view({"get": "list", "post": "create"}),
        name="table_content_view",
    ),
    path(
        "table-content/<str:table_name>/<int:pk>/",
        TableContentView.as_view(
            {"delete": "destroy", "put": "update", "patch": "partial_update"}
        ),
        name="table_content_delete",
    ),
]
