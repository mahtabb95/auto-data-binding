
from rest_framework import serializers
from .dbmodels import Hidden, Tperson, Tpipe, Tpipes, Book

class HiddenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hidden
        fields = '__all__'

class TpersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tperson
        fields = '__all__'

class TpipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tpipe
        fields = '__all__'

class TpipesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tpipes
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
