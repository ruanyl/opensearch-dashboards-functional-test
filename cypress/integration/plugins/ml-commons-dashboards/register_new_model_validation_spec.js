/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { MLC_URL } from '../../../utils/constants';

if (Cypress.env('ML_COMMONS_DASHBOARDS_ENABLED')) {
  describe('MLC - register new validation', () => {
    it('should display modal if button is clicked', () => {
      cy.visit(MLC_URL.REGISTER_NEW_MODEL);
      cy.contains('button', 'Register new model').click();
      cy.contains('label', 'Opensearch model repository').should('exist');
      cy.contains('label', 'Add your own model').should('exist');
    });
    it('should display modal if forst selection is clicked', () => {
      cy.visit(MLC_URL.REGISTER_NEW_MODEL);
      cy.contains('button', 'Register new model').click();
      cy.contains('label', 'Opensearch model repository').click();
      cy.get('input[data-test-subj="findModel"]');
      cy.contains('button', 'Cancel').should('exist');
      cy.contains('button', 'Continue').should('exist');
    });
    it('should display error if model name is duplicate', () => {
      const uploadModelName = 'sentence-transformers/all-distilroberta-v1';
      cy.visit(MLC_URL.REGISTER_NEW_MODEL);
      cy.contains('button', 'Register new model').click();
      cy.contains('label', 'Opensearch model repository').click();
      cy.get('input[data-test-subj="findModel"]').type(uploadModelName);
      cy.contains('button', 'Continue').click();
      cy.contains(`${uploadModelName}`);
    });
  });
}
