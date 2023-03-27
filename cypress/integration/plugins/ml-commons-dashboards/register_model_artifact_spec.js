/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { MLC_URL } from '../../../utils/constants';

if (Cypress.env('ML_COMMONS_DASHBOARDS_ENABLED')) {
  describe('MLC - model artifact validation', () => {
    const config = {
      model_type: 'bert',
      embedding_dimension: 768,
      framework_type: 'sentence_transformers',
      all_config:
        '{"architectures":["BertModel"],"max_position_embeddings":512,"model_type":"bert","num_attention_heads":12,"num_hidden_layers":6}',
    };

    function fillForm() {
      const uploadModelName = `traced_small_model-${new Date()
        .getTime()
        .toString(34)}`;

      cy.get('input[name="name"]').type(uploadModelName);

      // cy.fixture(
      //   'plugins/ml-commons-dashboards/models/traced_small_model.zip'
      // ).as('tracedSmallModel');
      // cy.get('input[type="file"]').selectFile('@tracedSmallModel');

      cy.contains('label', 'Model file format')
        .click()
        .type('Torchscript(.pt)');

      cy.contains('label', 'Configuration in JSON').type(
        JSON.stringify(config),
        { parseSpecialCharSequences: false }
      );
    }

    it('should display errors if model file is NOT selected', () => {
      cy.visit(MLC_URL.REGISTER_MODEL);
      fillForm();

      cy.contains('label', /from computer/i).click();

      cy.contains('button', 'Register model').click();
      // Field error
      cy.contains(/A file is required/i).should('exist');
      // Footer error
      cy.contains(/1 form error/i).should('exist');
      // Error Callout
      cy.contains(/Address the following error\(s\) in the form/i).should(
        'exist'
      );
    });

    it('should display errors if model url is empty', () => {
      cy.visit(MLC_URL.REGISTER_MODEL);

      cy.contains(/From URL/i).click();
      fillForm();

      cy.contains('button', 'Register model').click();
      // Field error
      cy.contains(/URL is required/i).should('exist');
      // Footer error
      cy.contains(/1 form error/i).should('exist');
      // Error Callout
      cy.contains(/Address the following error\(s\) in the form/i).should(
        'exist'
      );
    });

    it('should display errors if model url is NOT a valid url', () => {
      cy.visit(MLC_URL.REGISTER_MODEL);

      cy.contains(/From URL/i).click();
      cy.contains('label', /^url/i).click().type('not_a_url');
      fillForm();

      cy.contains('button', 'Register model').click();
      // Field error
      cy.contains(/URL is invalid/i).should('exist');
      // Footer error
      cy.contains(/1 form error/i).should('exist');
      // Error Callout
      cy.contains(/Address the following error\(s\) in the form/i).should(
        'exist'
      );
    });
  });
}
