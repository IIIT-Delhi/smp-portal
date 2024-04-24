from django.db.models import Func, JSONField

class JSONBuildObject(Func):
    output_field = JSONField()
    function = 'jsonb_build_object'

class JSONConcat(Func):
    output_field = JSONField()
    arg_joiner = ' || '
    template = '(%(expressions)s)'
