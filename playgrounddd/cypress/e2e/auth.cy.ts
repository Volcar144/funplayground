describe('Auth pages (smoke + client-side validation)', () => {
  it('signin page renders', () => {
    cy.visit('/signin');
    cy.contains(/sign in to your account/i).should('be.visible');
    cy.contains('label', 'Email').should('be.visible');
    cy.contains('label', 'Password').should('be.visible');
    cy.contains('button', /log in/i).should('be.visible');
  });

  it('signin invalid email shows error', () => {
    cy.visit('/signin');
    cy.get('input[type="email"]').type('not-an-email');
    cy.get('input[type="password"]').type('12345678');
    cy.contains('button', /log in/i).click();
    cy.contains(/email invalid/i).should('be.visible');
  });

  it('home redirects to signin when not authenticated (best-effort)', () => {
    cy.visit('/home');
    cy.location('pathname', { timeout: 10000 }).should('eq', '/signin');
  });
});
