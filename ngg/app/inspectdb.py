import os


path = "app/migrations/0001_initial.py"
if os.path.isfile(path):
    os.remove(path)

command = "python manage.py inspectdb > dbmodel.py"
mkmigrate = "python manage.py makemigrations"
migrate = "python manage.py migrate"
# run = "python manage.py runserver"
os.system(command)


file = "dbmodel.py"
base = os.path.splitext(file)[0]
os.rename(file, base + ".txt")

fin = open("dbmodel.txt", "rt")

fout = open("dbmodels.txt", "wt")

checkWords = (
    "AutoField()",
    "id = models.FloatField(blank=True, null=True)",
    "BooleanField",
    "id = models.BigIntegerField()",
    "\\",
)
repWords = (
    "AutoField(primary_key=True)",
    "id = models.BigIntegerField(primary_key=True, blank=True, null=True)",
    "IntegerField",
    "id = models.BigIntegerField(primary_key=True)",
    "/",
)

for line in fin:
    #     for check, rep in zip(checkWords, repWords):
    #         line = line.replace(check, rep)
    #         pass
    fout.write(line)
fin.close()
fout.close()

finalFile = "dbmodels.txt"
finalBase = os.path.splitext(finalFile)[0]
os.rename(finalFile, finalBase + ".py")
os.remove("C:/Users/asus/Desktop/ngg/dbmodel.txt")
os.remove("C:/Users/asus/Desktop/ngg/app/dbmodels.py")
os.rename(
    "C:/Users/asus/Desktop/ngg/dbmodels.py",
    "C:/Users/asus/Desktop/ngg/app/dbmodels.py",
)

os.system(mkmigrate)
os.system(migrate)

# from pathlib import Path


models_file_path = "C:/Users/asus/Desktop/ngg/app/dbmodels.py"


with open(models_file_path, "r") as models_file:
    models_content = models_file.read()

models = []
for line in models_content.split("\n"):
    if line.strip().startswith("class ") and line.strip().endswith("(models.Model):"):
        model_name = line.strip().split()[1]
        models.append(model_name)
model_names = [model.split("(")[0].strip() for model in models]


table_name = []
django_tables = [
    "DjangoAdminLog",
    "AuthPermission",
    "AuthUserUserPermissions",
    "AuthUserGroups",
    "AuthGroup",
    "AuthUser",
    "DjangoContentType",
    "DjangoSession",
    "DjangoMigrations",
    "BooksDimeducation",
    "BooksBook",
    "AuthGroupPermissions",
    "AppApp",
]
for model in model_names:
    if model not in django_tables:
        table_name.append(model)


for model_name in table_name:
    print(model_name)
table_name_string = ", ".join(table_name)


serializers_content = f"""
from rest_framework import serializers
from .dbmodels import {table_name_string}
"""

admin_content = f"""
from django.contrib import admin
from .dbmodels import {table_name_string}
"""

serializersName = []
for model in table_name:
    serializers_content += f"""
class {model}Serializer(serializers.ModelSerializer):
    class Meta:
        model = {model}
        fields = '__all__'
"""
    serializersName.append(f"{model}Serializer")
    admin_content += f"""
admin.site.register({model})
"""

serializersName_string = ", ".join(serializersName)
views_content = f"""
from rest_framework import viewsets,serializers,status
from django.apps import apps
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from .dbmodels import {table_name_string}
from .serializers import {serializersName_string}

"""

for model in table_name:
    views_content += f"""
class {model}ViewSet(viewsets.ModelViewSet):
    queryset = {model}.objects.all()
    serializer_class = {model}Serializer
    authentication_classes = (TokenAuthentication,)

"""
views_content += f"""
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
            "hiddenColumns"
        ]
        for model in apps.get_models():
            if model._meta.db_table not in django_tables:
                table_name.append(model._meta.db_table)
        self.queryset = table_name
        return Response(table_name)


class TableContentView(viewsets.GenericViewSet):
    authentication_classes = (TokenAuthentication,)
    def list(self, request, table_name):
        model = apps.get_model(app_label="app", model_name=table_name)
        if model is None:
            return JsonResponse({{"error": "Table Not Found"}}, status=404)
        table_content = model.objects.all()
        field_types = [
            {{
                "name": str(item.name),
                "type": str(type(item))
                .replace("<class 'django.db.models.fields.", "")
                .replace("'>", ""),
            }}
            for item in model._meta.get_fields()
        ]
        field_names = []
        for field in model._meta.get_fields():
            field_names.append(field.name)
        serialized_data = []
        for item in table_content:
            tmp = {{}}
            for field in field_names:
                tmp[field] = getattr(item, field)
            serialized_data.append(tmp)
        return JsonResponse(
            {{
                "table_content": serialized_data,
                "field_names": field_names,
                "field_type": field_types,
            }}
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
                {{"error": "Model Not Found"}}, status=status.HTTP_404_NOT_FOUND
            )

        serializer_class_name = f"{{table_name}}Serializer"
        serializer = type(
            serializer_class_name,
            (serializers.ModelSerializer,),
            {{
                "Meta": type("Meta", (object,), {{"model": model, "fields": "__all__"}}),
            }},
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



"""

serializers_file_path = "C:/Users/asus/Desktop/ngg/app/serializers.py"
views_file_path = "C:/Users/asus/Desktop/ngg/app/views.py"
admin_file_path = "C:/Users/asus/Desktop/ngg/app/admin.py"
with open(serializers_file_path, "w") as serializers_file:
    serializers_file.write(serializers_content)
with open(views_file_path, "w") as views_file:
    views_file.write(views_content)
with open(admin_file_path, "w") as admin_file:
    admin_file.write(admin_content)

print(table_name)


print("Serializers have been generated successfully.")
