# Generated by Django 5.0 on 2023-12-23 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AuthGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=150, unique=True)),
            ],
            options={
                'db_table': 'auth_group',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthGroupPermissions',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_group_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthPermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=255)),
                ('codename', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=100)),
            ],
            options={
                'db_table': 'auth_permission',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthtokenToken',
            fields=[
                ('key', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=40, primary_key=True, serialize=False)),
                ('created', models.DateTimeField()),
            ],
            options={
                'db_table': 'authtoken_token',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=128)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('is_superuser', models.BooleanField()),
                ('username', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=150, unique=True)),
                ('first_name', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=150)),
                ('last_name', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=150)),
                ('email', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=254)),
                ('is_staff', models.BooleanField()),
                ('is_active', models.BooleanField()),
                ('date_joined', models.DateTimeField()),
            ],
            options={
                'db_table': 'auth_user',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserGroups',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_user_groups',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserUserPermissions',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_user_user_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('author', models.CharField(blank=True, db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=50, null=True)),
                ('id', models.IntegerField(db_column='Id', primary_key=True, serialize=False)),
                ('published', models.DateField(blank=True, null=True)),
                ('rate', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'book',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='BooksBook',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=100)),
                ('writer', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=40)),
                ('published', models.DateField()),
                ('age', models.IntegerField()),
                ('education', models.IntegerField()),
                ('ismarried', models.BooleanField(db_column='isMarried')),
            ],
            options={
                'db_table': 'books_book',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='BooksDimeducation',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=30)),
            ],
            options={
                'db_table': 'books_dimeducation',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoAdminLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_time', models.DateTimeField()),
                ('object_id', models.TextField(blank=True, db_collation='SQL_Latin1_General_CP1_CI_AS', null=True)),
                ('object_repr', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=200)),
                ('action_flag', models.SmallIntegerField()),
                ('change_message', models.TextField(db_collation='SQL_Latin1_General_CP1_CI_AS')),
                ('user_id', models.IntegerField()),
            ],
            options={
                'db_table': 'django_admin_log',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoContentType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app_label', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=100)),
                ('model', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=100)),
            ],
            options={
                'db_table': 'django_content_type',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoMigrations',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('app', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=255)),
                ('name', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=255)),
                ('applied', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_migrations',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoSession',
            fields=[
                ('session_key', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=40, primary_key=True, serialize=False)),
                ('session_data', models.TextField(db_collation='SQL_Latin1_General_CP1_CI_AS')),
                ('expire_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_session',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Hidden',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('colname', models.CharField(blank=True, db_collation='SQL_Latin1_General_CP1_CI_AS', db_column='colName', max_length=50, null=True)),
            ],
            options={
                'db_table': 'Hidden',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Sysdiagrams',
            fields=[
                ('name', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=128)),
                ('principal_id', models.IntegerField()),
                ('diagram_id', models.AutoField(primary_key=True, serialize=False)),
                ('version', models.IntegerField(blank=True, null=True)),
                ('definition', models.BinaryField(blank=True, null=True)),
            ],
            options={
                'db_table': 'sysdiagrams',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Tperson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstname', models.CharField(blank=True, db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=50, null=True)),
                ('lastname', models.CharField(blank=True, db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=50, null=True)),
                ('birthdate', models.DateField(blank=True, null=True)),
                ('ismarried', models.IntegerField(blank=True, null=True)),
                ('education', models.IntegerField(blank=True, null=True)),
                ('uni', models.IntegerField(blank=True, null=True)),
                ('father_name', models.CharField(blank=True, db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=50, null=True)),
                ('mother_name', models.CharField(blank=True, db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=50, null=True)),
            ],
            options={
                'db_table': 'TPerson',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Tpipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_name', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=255)),
                ('field_id', models.IntegerField()),
                ('field_translation', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=255)),
            ],
            options={
                'db_table': 'TPipe',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Tpipes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_name', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=20)),
                ('field_id', models.IntegerField()),
                ('field_translate', models.CharField(db_collation='SQL_Latin1_General_CP1_CI_AS', max_length=20)),
            ],
            options={
                'db_table': 'TPipes',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='publish',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
            ],
        ),
    ]
