#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""

import os
import sys


def main():
    """Run administrative tasks."""
    # `manage.py test` usa la configuración de pruebas; el resto, la de desarrollo local.
    # DJANGO_SETTINGS_MODULE o --settings tienen prioridad sobre ambos valores.
    por_defecto = "config.settings.test" if sys.argv[1:2] == ["test"] else "config.settings.local"
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", por_defecto)
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
