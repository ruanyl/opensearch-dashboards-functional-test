/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { MLC_URL } from '../../../utils/constants';

if (Cypress.env('ML_COMMONS_DASHBOARDS_ENABLED')) {
  describe('MLC - model configuration validation', () => {
    const config = {
      model_type: 'bert',
      embedding_dimension: 768,
      framework_type: 'sentence_transformers',
      all_config:
        '{"architectures":["BertModel"],"max_position_embeddings":512,"model_type":"bert","num_attention_heads":12,"num_hidden_layers":6}',
    };

    function fillForm(modelConfigStr) {
      const uploadModelName = `traced_small_model-${new Date()
        .getTime()
        .toString(34)}`;

      cy.get('input[name="name"]').type(uploadModelName);
      cy.fixture(
        'plugins/ml-commons-dashboards/models/traced_small_model.zip'
      ).as('tracedSmallModel');
      cy.get('input[type="file"]').selectFile('@tracedSmallModel');

      cy.contains('label', 'Model file format')
        .click()
        .type('Torchscript(.pt)');

      if (modelConfigStr) {
        cy.contains('label', 'Configuration in JSON').type(modelConfigStr, {
          parseSpecialCharSequences: false,
        });
      }
    }

    it('should display errors if model configuration is empty', () => {
      cy.visit(MLC_URL.REGISTER_MODEL);
      fillForm();
      cy.contains('button', 'Register model').click();

      // Field error
      cy.contains(/Configuration is required/i).should('exist');
      // Footer error
      cy.contains(/1 form error/i).should('exist');
      // Error Callout
      cy.contains(/Address the following error\(s\) in the form/i).should(
        'exist'
      );
    });

    it('should display errors if model configuration is an invalid JSON object', () => {
      cy.visit(MLC_URL.REGISTER_MODEL);
      fillForm('{invalid:');
      cy.contains('button', 'Register model').click();

      // Field error
      cy.contains(/JSON is invalid/i).should('exist');
      // Footer error
      cy.contains(/1 form error/i).should('exist');
      // Error Callout
      cy.contains(/Address the following error\(s\) in the form/i).should(
        'exist'
      );
    });

    it('should display errors if model configuration missing model_type', () => {
      cy.visit(MLC_URL.REGISTER_MODEL);
      fillForm(JSON.stringify({}));
      cy.contains('button', 'Register model').click();

      // Field error
      cy.contains(/model_type is required/i).should('exist');
      // Footer error
      cy.contains(/1 form error/i).should('exist');
      // Error Callout
      cy.contains(/Address the following error\(s\) in the form/i).should(
        'exist'
      );
    });

    it('should display errors if embedding_dimension is NOT a number', () => {
      cy.visit(MLC_URL.REGISTER_MODEL);
      fillForm(JSON.stringify({ ...config, embedding_dimension: 'invalid' }));
      cy.contains('button', 'Register model').click();

      // Field error
      cy.contains(/embedding_dimension must be a number/i).should('exist');
      // Footer error
      cy.contains(/1 form error/i).should('exist');
      // Error Callout
      cy.contains(/Address the following error\(s\) in the form/i).should(
        'exist'
      );
    });

    it('should display errors if framework_type is NOT a string', () => {
      cy.visit(MLC_URL.REGISTER_MODEL);
      fillForm(JSON.stringify({ ...config, framework_type: 768 }));
      cy.contains('button', 'Register model').click();

      // Field error
      cy.contains(/framework_type must be a string/i).should('exist');
      // Footer error
      cy.contains(/1 form error/i).should('exist');
      // Error Callout
      cy.contains(/Address the following error\(s\) in the form/i).should(
        'exist'
      );
    });
  });
}
