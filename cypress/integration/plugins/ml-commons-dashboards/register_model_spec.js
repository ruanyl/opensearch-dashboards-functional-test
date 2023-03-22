/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { MLC_URL } from '../../../utils/constants';

if (Cypress.env('ML_COMMONS_DASHBOARDS_ENABLED')) {
  describe('MLC - create new model', () => {
    before(() => {
      // Disable only_run_on_ml_node to avoid model upload error in case of cluster no ml nodes
      cy.disableOnlyRunOnMLNode();
      cy.disableNativeMemoryCircuitBreaker();
      cy.wait(1000);
    });

    after(() => {});

    it('should display register model form when opening register model page', () => {
      cy.visit(MLC_URL.REGISTER_MODEL);
      cy.get('h1').should('have.text', 'Register model');
      cy.get('input[name="name"]').should('have.length', 1).should('be.empty');
      cy.get('textarea[name="description"]')
        .should('have.length', 1)
        .should('be.empty');
      cy.contains('button', 'Add new tag').should('have.length', 1);
      cy.get('input[name="modelSource"]').should('exist');
      cy.contains('label', 'From computer').should('exist');
      cy.contains('label', 'From URL').should('exist');
      cy.contains('label', 'File').should('exist');
      cy.contains('label', 'Model file format').should('exist');
      cy.contains('label', 'Configuration in JSON').should('exist');
      cy.contains('label', 'Notes').should('exist');
    });

    it('should upload model by file', () => {
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

      const config = {
        model_type: 'bert',
        embedding_dimension: 768,
        framework_type: 'sentence_transformers',
        all_config:
          '{"architectures":["BertModel"],"max_position_embeddings":512,"model_type":"bert","num_attention_heads":12,"num_hidden_layers":6}',
      };
      cy.contains('label', 'Configuration in JSON').type(
        JSON.stringify(config),
        { parseSpecialCharSequences: false }
      );

      cy.contains('button', 'Register model').click();
      cy.contains('span', `${uploadModelName} model creation complete.`).should(
        'exist'
      );
    });
  });
}
