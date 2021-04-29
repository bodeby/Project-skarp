describe('My settings page Test', () => {
    it('Visits the login page for any user', () => {
        cy.visit('localhost:3000/login');
        cy.get('.action-register').click();
        cy.get('.action-login').click();

        // Get an email input, type into it and verify that the value has been updated
        cy.get('.action-email')
        .type('fake@email.com')
        .should('have.value', 'fake@email.com');
        
        // Get an password input, type into it and verify that the value has been updated
        cy.get('.action-password')
        .type('Ming#1359')
        .should('have.value', 'Ming#1359');
        cy.get('.action-submit').click();
        
        // When you login a test will be conducted to check if the user got a cookie.
        cy.getCookie('auth').should('have.property','value','608911a0070ea135f09e3705')

        cy.get('.action-menu').click();
        cy.get('.settings-button').click();

        cy.get('.first-name-text').click()
        .clear()
        .type('Fake')
        .should('have.value', 'Fake');

        cy.get('.last-name-text').click()
        .clear()
        .type('Fakesen')
        .should('have.value', 'Fakesen');

        // Invoke a function on the previously yielded subject, then use that to have equal to the subject.
        cy.get('select').select(['EUR'])
        .invoke('val')
        .should('have.equal', 'EUR');
        
        cy.get('.update-user-settings').click();

        cy.get('.action-menu').click();
        cy.get('.settings-button').click();

        cy.get('.sustainability-choice')
        .clear()
        .type('46')
        .should('have.value', '46');

        cy.get('.update-sustainability-choice').click();

        cy.get('.home-button').click();
    });
});