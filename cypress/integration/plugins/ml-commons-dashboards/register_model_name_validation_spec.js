/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { MLC_URL } from '../../../utils/constants';

if (Cypress.env('ML_COMMONS_DASHBOARDS_ENABLED')) {
  describe('MLC - model name validation', () => {
    const config = {
      model_type: 'bert',
      embedding_dimension: 768,
      framework_type: 'sentence_transformers',
      all_config:
        '{"architectures":["BertModel"],"max_position_embeddings":512,"model_type":"bert","num_attention_heads":12,"num_hidden_layers":6}',
    };

    function fillForm(modelName) {
      cy.get('input[name="name"]').type(modelName);

      cy.fixture(
        'plugins/ml-commons-dashboards/models/traced_small_model.zip'
      ).as('tracedSmallModel');
      cy.get('input[type="file"]').selectFile('@tracedSmallModel');

      cy.contains('label', 'Model file format')
        .click()
        .type('Torchscript(.pt)');

      cy.contains('label', 'Configuration in JSON').type(
        JSON.stringify(config),
        { parseSpecialCharSequences: false }
      );
    }

    it('should display errors if model name is empty', () => {
      cy.visit(MLC_URL.REGISTER_MODEL);
      cy.get('input[name="name"]').clear();

      cy.fixture(
        'plugins/ml-commons-dashboards/models/traced_small_model.zip'
      ).as('tracedSmallModel');
      cy.get('input[type="file"]').selectFile('@tracedSmallModel');

      cy.contains('label', 'Model file format')
        .click()
        .type('Torchscript(.pt)');

      cy.contains('label', 'Configuration in JSON').type(
        JSON.stringify(config),
        { parseSpecialCharSequences: false }
      );

      cy.contains('button', 'Register model').click();

      // Field error
      cy.contains(/name can not be empty/i).should('exist');
      // Footer error
      cy.contains(/1 form error/i).should('exist');
      // Error Callout
      cy.contains(/Address the following error\(s\) in the form/i).should(
        'exist'
      );
    });

    it('should display error if model name is duplicate', () => {
      const uploadModelName = `traced_small_model-${new Date()
        .getTime()
        .toString(34)}`;

      // 1. Create a model
      cy.visit(MLC_URL.REGISTER_MODEL);
      fillForm(uploadModelName);
      cy.contains('button', 'Register model').click();
      cy.contains(`${uploadModelName} model creation complete.`).should(
        'exist'
      );
      // Model Artifact uploaded from local
      cy.contains(`Artifact for ${uploadModelName} uploaded`, {
        timeout: 60000,
      }).should('exist');

      // 2. Create a model with the same name
      cy.visit(MLC_URL.REGISTER_MODEL);
      fillForm(uploadModelName);
      cy.contains('button', 'Register model').click();
      // Field error
      cy.contains(/Use a unique name for the model/i).should('exist');
      // Footer error
      cy.contains(/1 form error/i).should('exist');
      // Error Callout
      cy.contains(/Address the following error\(s\) in the form/i).should(
        'exist'
      );

      // TODO:
      // 1. it should click and navigate to model version page
      // 2. it should delete the uploaded model by clicking delete button
    });
  });
}
