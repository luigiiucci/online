/* global describe it cy beforeEach require afterEach */

var helper = require('../../common/helper');
var mobileHelper = require('../../common/mobile_helper');

describe(['tagmobile', 'tagnextcloud', 'tagproxy'], 'Annotation Tests',function() {
	var origTestFileName = 'annotation.ods';
	var testFileName;

	beforeEach(function() {
		testFileName = helper.beforeAll(origTestFileName, 'calc');

		// Click on edit button
		mobileHelper.enableEditingMobile();
	});

	afterEach(function() {
		helper.afterAll(testFileName, this.currentTest.state);
	});

	it('Saving comment.', function() {
		mobileHelper.insertComment();
		cy.cGet('#comment-container-1').should('exist');
		mobileHelper.selectHamburgerMenuItem(['File', 'Save']);

		helper.reload(testFileName, 'calc', true);
		mobileHelper.enableEditingMobile();
		mobileHelper.openCommentWizard();
		helper.waitUntilIdle('#mobile-wizard-content', undefined);
		cy.cGet('#annotation-content-area-1').should('have.text', 'some text');
		cy.cGet('#comment-container-1').should('exist');
	});

	it('Modifying comment.', function() {
		mobileHelper.insertComment();
		cy.cGet('#comment-container-1').should('exist');
		mobileHelper.selectAnnotationMenuItem('Modify');
		cy.cGet('#annotation-content-area-1').should('have.text', 'some text');
		cy.cGet('#new-mobile-comment-input-area').type('modified ');
		cy.cGet('.vex-dialog-buttons .button-primary').click();
		cy.cGet('#comment-container-1').should('exist');
		cy.cGet('#annotation-content-area-1').should('have.text', 'modified some text');
	});

	it('Remove comment.', function() {
		mobileHelper.insertComment();
		cy.cGet('#comment-container-1').should('exist');
		cy.cGet('#annotation-content-area-1').should('have.text', 'some text');
		mobileHelper.selectAnnotationMenuItem('Remove');
		cy.cGet('#annotation-content-area-1').should('not.exist');
		cy.cGet('#comment-container-1').should('not.exist');
	});

	it('Try to insert empty comment.', function() {
		mobileHelper.openInsertionWizard();

		cy.cGet('body').contains('.menu-entry-with-icon', 'Comment').click();
		cy.cGet('.cool-annotation-table').should('exist');
		cy.cGet('.cool-annotation-textarea').should('have.text', '');
		cy.cGet('.vex-dialog-buttons .button-primary').click();
		cy.cGet('.vex-dialog-buttons .button-secondary').click();
		cy.cGet('.cool-annotation-content-wrapper.wizard-comment-box').should('not.exist');
		cy.cGet('.wizard-comment-box .cool-annotation-content').should('not.exist');
	});
});
