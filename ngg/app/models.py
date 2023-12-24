from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.query import QuerySet


# Create your models here.
class publish(models.Model):
    name = models.CharField(max_length=30)


# class User(AbstractUser):
#     class Role(models.TextChoices):
#         ADMIN = "ADMIN", "Admin"
#         MANAGER = "MANAGER", "Manager"
#         CUSTOMER = "CUSTOMER", "Customer"

#     base_role = Role.ADMIN

#     role = models.CharField(max_length=50, choices=Role.choices)

#     def save(self, *args, **kwargs):
#         if not self.pk:
#             self.role = self.base_role
#             return super().save(*args, **kwargs)

#     class Meta:
#         app_label = "app"


# class ManagerManager(BaseUserManager):
#     def get_queryset(self, *args, **kwargs):
#         results = super().get_queryset(*args, **kwargs)
#         return results.filter(role=User.Role.MANAGER)


# class Manager(User):
#     base_role = User.Role.MANAGER
#     manager = ManagerManager()

#     # class Meta:
#     #     proxy = True

#     def welcome(self):
#         return "Only for Managers"


# class CustomerManager(BaseUserManager):
#     def get_queryset(self, *args, **kwargs):
#         results = super().get_queryset(*args, **kwargs)
#         return results.filter(role=User.Role.CUSTOMER)


# class Customer(User):
#     base_role = User.Role.CUSTOMER
#     Customer = CustomerManager()

#     # class Meta:
#     #     proxy = True

#     def welcome(self):
#         return "Only for Customers"
