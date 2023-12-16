from rest_framework import serializers
from .dbmodels import Hidden, Tperson, Tpipe, Tpipes, Book
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "password")
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    # def create(self, validated_data):
    #     user = User.objects.create_user(**validated_data)
    #     Token.objects.create(user=user)
    #     return user


class HiddenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hidden
        fields = "__all__"


class TpersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tperson
        fields = "__all__"


class TpipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tpipe
        fields = "__all__"


class TpipesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tpipes
        fields = "__all__"


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"
