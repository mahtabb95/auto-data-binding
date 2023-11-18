
from django.contrib import admin
from .dbmodels import Hidden, Tperson, Tpipe, Tpipes, Book

admin.site.register(Hidden)

admin.site.register(Tperson)

admin.site.register(Tpipe)

admin.site.register(Tpipes)

admin.site.register(Book)
