from django.db import models
from relationships.models import Affiliate, Business, Individual


class GlobalStatement(models.Model):
    affiliate = models.ForeignKey(Affiliate, on_delete=models.CASCADE, related_name='global_statements')
    entity = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='global_statements')
    individual = models.ForeignKey(Individual, on_delete=models.CASCADE, related_name='global_statements')

    # Any other fields you need for the GlobalStatement model

    def __str__(self):
        return f"Global Statement ID: {self.pk}"
