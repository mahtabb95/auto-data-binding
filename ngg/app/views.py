from rest_framework import viewsets, serializers, status
from django.apps import apps
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .dbmodels import Hidden, Tperson, Tpipe, Tpipes, Book, Sysdiagrams
from django.contrib.auth.models import User

from .serializers import (
    HiddenSerializer,
    TpersonSerializer,
    TpipeSerializer,
    TpipesSerializer,
    BookSerializer,
    SysdiagramsSerializer,
    UserSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)


class HiddenViewSet(viewsets.ModelViewSet):
    queryset = Hidden.objects.all()
    serializer_class = HiddenSerializer
    authentication_classes = (TokenAuthentication,)


class TpersonViewSet(viewsets.ModelViewSet):
    queryset = Tperson.objects.all()
    serializer_class = TpersonSerializer
    authentication_classes = (TokenAuthentication,)


class TpipeViewSet(viewsets.ModelViewSet):
    queryset = Tpipe.objects.all()
    serializer_class = TpipeSerializer
    authentication_classes = (TokenAuthentication,)


class TpipesViewSet(viewsets.ModelViewSet):
    queryset = Tpipes.objects.all()
    serializer_class = TpipesSerializer
    authentication_classes = (TokenAuthentication,)


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    authentication_classes = (TokenAuthentication,)


class TableListView(viewsets.GenericViewSet):
    authentication_classes = (TokenAuthentication,)

    def list(self, request):
        table_name = []
        django_tables = [
            "django_admin_log",
            "auth_permission",
            "auth_group",
            "auth_user",
            "django_content_type",
            "django_session",
            "auth_group_permissions",
            "auth_user_groups",
            "auth_user_user_permissions",
            "books_book",
            "books_dimeducation",
            "django_migrations",
            "app_app",
            "app_publish",
            "hiddenColumns",
        ]
        for model in apps.get_models():
            if model._meta.db_table not in django_tables:
                table_name.append(model._meta.db_table)
        self.queryset = table_name
        return Response(table_name)


class TableContentView(viewsets.GenericViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def list(self, request, table_name):
        model = apps.get_model(app_label="app", model_name=table_name)
        if model is None:
            return JsonResponse({"error": "Table Not Found"}, status=404)
        table_content = model.objects.all()
        field_types = [
            {
                "name": str(item.name),
                "type": str(type(item))
                .replace("<class 'django.db.models.fields.", "")
                .replace("'>", ""),
            }
            for item in model._meta.get_fields()
        ]
        field_names = []
        for field in model._meta.get_fields():
            field_names.append(field.name)
        serialized_data = []
        for item in table_content:
            tmp = {}
            for field in field_names:
                tmp[field] = getattr(item, field)
            serialized_data.append(tmp)
        return JsonResponse(
            {
                "table_content": serialized_data,
                "field_names": field_names,
                "field_type": field_types,
            }
        )

    def get_queryset(self):
        table_name = self.kwargs.get("table_name")
        model = apps.get_model(app_label="app", model_name=table_name)
        if model is None:
            return model.objects.none()
        return model.objects.all()

    def get_serializer(self, *args, **kwargs):
        table_name = self.kwargs.get("table_name")
        model = apps.get_model(app_label="app", model_name=table_name)
        if model is None:
            return Response(
                {"error": "Model Not Found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer_class_name = f"{table_name}Serializer"
        serializer = type(
            serializer_class_name,
            (serializers.ModelSerializer,),
            {
                "Meta": type("Meta", (object,), {"model": model, "fields": "__all__"}),
            },
        )
        return serializer(*args, **kwargs)

    def create(self, request, table_name):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, table_name, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, table_name, pk=None):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
