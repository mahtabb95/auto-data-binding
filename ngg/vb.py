from rest_framework import viewsets
from django.views import View
from rest_framework import generics
from .app.dbmodels import (
    Infobook,
    Infodimeducation,
    Infomarried,
    Tperson,
    Tpipe,
    Tpipes,
    Ttest2,
    Tab,
    AppApp,
)
from .app.serializers import (
    InfobookSerializer,
    InfodimeducationSerializer,
    InfomarriedSerializer,
    TpersonSerializer,
    TpipeSerializer,
    TpipesSerializer,
    Ttest2Serializer,
    TabSerializer,
    AppAppSerializer,
)
from django.apps import apps
from django.http import JsonResponse
from rest_framework.response import Response
from django.middleware.csrf import get_token


class CsrfTokenView(View):
    def get(self, request, *args, **kwargs):
        csrf_token = get_token(request)
        return JsonResponse({"csrf_token": csrf_token})


class TableContentView(viewsets.ModelViewSet):
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


# def table_content_view(request, table_name):
#     model = apps.get_model(app_label="app", model_name=table_name)
#     if model is None:
#         return JsonResponse({"error": "Table Not Found"}, status=404)
#     table_content = model.objects.all()

#     field_types = [
#         {
#             "name": str(item.name),
#             "type": str(type(item))
#             .replace("<class 'django.db.models.fields.", "")
#             .replace("'>", ""),
#         }
#         for item in model._meta.get_fields()
#     ]
#     field_names = []
#     for field in model._meta.get_fields():
#         field_names.append(field.name)
#     serialized_data = []
#     for item in table_content:
#         tmp = {}
#         for field in field_names:
#             tmp[field] = getattr(item, field)
#         serialized_data.append(tmp)
#     return JsonResponse(
#         {
#             "table_content": serialized_data,
#             "field_names": field_names,
#             "field_type": field_types,
#         }
#     )


class InfobookViewSet(viewsets.ModelViewSet):
    queryset = Infobook.objects.all()
    serializer_class = InfobookSerializer

    def get_serializer(self, instance=None, data=None, many=False, partial=False):
        if self.action == "create":
            return super(InfobookViewSet, self).get_serializer(
                instance=instance, data=data, many=True, partial=partial
            )
        else:
            if data:
                return super(InfobookViewSet, self).get_serializer(
                    instance=instance, data=data, many=many, partial=partial
                )
            else:
                return super(InfobookViewSet, self).get_serializer(
                    instance=instance, many=many, partial=partial
                )

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class InfodimeducationViewSet(viewsets.ModelViewSet):
    queryset = Infodimeducation.objects.all()
    serializer_class = InfodimeducationSerializer


class InfomarriedViewSet(viewsets.ModelViewSet):
    queryset = Infomarried.objects.all()
    serializer_class = InfomarriedSerializer


class TpersonViewSet(viewsets.ModelViewSet):
    queryset = Tperson.objects.all()  # getqueryset
    serializer_class = TpersonSerializer  # getserializer

    def list(self, request):
        self.model = Tperson
        self.fields = [
            {
                "name": str(item.name),
                "type": str(type(item))
                .replace("<class 'django.db.models.fields.", "")
                .replace("'>", ""),
            }
            for item in self.model._meta.get_fields()
        ]
        serializer = TpersonSerializer(Tperson.objects.all(), many=True)
        response_data = {"dataTypes": self.fields, "data": serializer.data}
        return Response(response_data)


class TpipeViewSet(viewsets.ModelViewSet):
    queryset = Tpipe.objects.all()
    serializer_class = TpipeSerializer


class TpipesViewSet(viewsets.ModelViewSet):
    queryset = Tpipes.objects.all()
    serializer_class = TpipesSerializer


class Ttest2ViewSet(viewsets.ModelViewSet):
    queryset = Ttest2.objects.all()
    serializer_class = Ttest2Serializer


class TabViewSet(viewsets.ModelViewSet):
    queryset = Tab.objects.all()
    serializer_class = TabSerializer


class AppAppViewSet(viewsets.ModelViewSet):
    queryset = AppApp.objects.all()
    serializer_class = AppAppSerializer


class TableListView(viewsets.GenericViewSet):
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
        ]
        for model in apps.get_models():
            if model._meta.db_table not in django_tables:
                table_name.append(model._meta.db_table)
        self.queryset = table_name
        return Response(table_name)


from django.urls import path, include
from rest_framework import routers
from .views import (
    TpersonViewSet,
    TpipesViewSet,
    InfobookViewSet,
    InfodimeducationViewSet,
    InfomarriedViewSet,
    TableListView,
    CsrfTokenView,
    TableContentView,
)


router = routers.DefaultRouter()
router.register("book", InfobookViewSet)
router.register("level", InfodimeducationViewSet)
router.register("Married", InfomarriedViewSet)
router.register("person", TpersonViewSet, basename="person")
router.register("pipe", TpipesViewSet)
router.register("table", TableListView, basename="table")


urlpatterns = [
    path("", include(router.urls)),
    path("table-content/<str:table_name>/", TableContentView.as_view({"get": "list"})),
    # path("csrf-token", CsrfTokenView.as_view(), name="csrf-token"),
]




# second edition
from django.apps import apps
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import viewsets, status, serializers
from .dbmodels import Tperson, Tpipe, Tpipes, Book
from .serializers import (
    TpersonSerializer,
    TpipeSerializer,
    TpipesSerializer,
    BookSerializer,
)


class TpersonViewSet(viewsets.ModelViewSet):
    queryset = Tperson.objects.all()  # getqueryset
    serializer_class = TpersonSerializer  # getserializer

    def list(self, request):
        self.model = Tperson
        self.fields = [
            {
                "name": str(item.name),
                "type": str(type(item))
                .replace("<class 'django.db.models.fields.", "")
                .replace("'>", ""),
            }
            for item in self.model._meta.get_fields()
        ]
        serializer = TpersonSerializer(Tperson.objects.all(), many=True)
        response_data = {"dataTypes": self.fields, "data": serializer.data}
        return Response(response_data)


class TpipeViewSet(viewsets.ModelViewSet):
    queryset = Tpipe.objects.all()
    serializer_class = TpipeSerializer


class TpipesViewSet(viewsets.ModelViewSet):
    queryset = Tpipes.objects.all()
    serializer_class = TpipesSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class TableListView(viewsets.GenericViewSet):
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
        ]
        for model in apps.get_models():
            if model._meta.db_table not in django_tables:
                table_name.append(model._meta.db_table)
        self.queryset = table_name
        return Response(table_name)


class TableContentView(viewsets.GenericViewSet):
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
                "Meta": type("Meta", (object,), {"model": model}),
            },
        )
        return serializer(data=kwargs.get("data"), *args, **kwargs)

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

    # def get_serializer(self, instance=None, data=None, many=False, partial=False):
    # if self.action == "create":
    #     return super(TableContentView, self).get_serializer(
    #         instance=instance, data=data, many=True, partial=partial
    # )
    # else:
    #     if data:
    #         return super(TableContentView, self).get_serializer(
    #             instance=instance, data=data, many=many, partial=partial
    #         )
    #     else:
    #         return super(TableContentView, self).get_serializer(
    #             instance=instance, many=many, partial=partial
    #         )

    # def create(self, request, *args, **kwargs):
    #     return super().create(request, *args, **kwargs)





class TableListView(viewsets.GenericViewSet):
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
        ]
        for model in apps.get_models():
            if model._meta.db_table not in django_tables:
                table_name.append(model._meta.db_table)
        self.queryset = table_name
        return Response(table_name)


class TableContentView(viewsets.GenericViewSet):
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


# final code 
from rest_framework import viewsets, serializers, status
from django.apps import apps
from django.http import JsonResponse
from rest_framework.response import Response
from .dbmodels import Tperson, Tpipe, Tpipes, Book
from .serializers import (
    TpersonSerializer,
    TpipeSerializer,
    TpipesSerializer,
    BookSerializer,
)


class TpersonViewSet(viewsets.ModelViewSet):
    queryset = Tperson.objects.all()
    serializer_class = TpersonSerializer


class TpipeViewSet(viewsets.ModelViewSet):
    queryset = Tpipe.objects.all()
    serializer_class = TpipeSerializer


class TpipesViewSet(viewsets.ModelViewSet):
    queryset = Tpipes.objects.all()
    serializer_class = TpipesSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class TableListView(viewsets.GenericViewSet):
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
        ]
        for model in apps.get_models():
            if model._meta.db_table not in django_tables:
                table_name.append(model._meta.db_table)
        self.queryset = table_name
        return Response(table_name)


class TableContentView(viewsets.GenericViewSet):
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
