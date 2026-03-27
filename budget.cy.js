describe('Kalkulator budżetu domowego', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.reload();
  });

  it('dodaje poprawny wydatek', () => {
    cy.get('#name').type('Zakupy');
    cy.get('#amount').type('120');
    cy.get('#category').select('Jedzenie');
    cy.contains('Dodaj wydatek').click();

    cy.get('#expenseList').should('contain', 'Zakupy');
    cy.get('#expenseList').should('contain', '120.00 zł');
    cy.get('#totalAmount').should('have.text', '120.00 zł');
  });

  it('pokazuje błąd przy pustym formularzu', () => {
    cy.contains('Dodaj wydatek').click();

    cy.get('#errorMessage').should('contain', 'Podaj nazwę wydatku.');
    cy.get('#expenseList').find('tr').should('have.length', 0);
  });

  it('liczy łączną sumę kilku wydatków', () => {
    cy.get('#name').type('Czynsz');
    cy.get('#amount').type('1500');
    cy.get('#category').select('Rachunki');
    cy.contains('Dodaj wydatek').click();

    cy.get('#name').type('Bilet miesięczny');
    cy.get('#amount').type('100');
    cy.get('#category').select('Transport');
    cy.contains('Dodaj wydatek').click();

    cy.get('#totalAmount').should('have.text', '1600.00 zł');
  });

  it('usuwa wydatek', () => {
    cy.get('#name').type('Kino');
    cy.get('#amount').type('45');
    cy.get('#category').select('Rozrywka');
    cy.contains('Dodaj wydatek').click();

    cy.get('.delete-btn').click();

    cy.get('#expenseList').find('tr').should('have.length', 0);
    cy.get('#totalAmount').should('have.text', '0.00 zł');
  });

  it('filtruje wydatki po kategorii', () => {
    cy.get('#name').type('Pizza');
    cy.get('#amount').type('35');
    cy.get('#category').select('Jedzenie');
    cy.contains('Dodaj wydatek').click();

    cy.get('#name').type('Prąd');
    cy.get('#amount').type('220');
    cy.get('#category').select('Rachunki');
    cy.contains('Dodaj wydatek').click();

    cy.get('#filterCategory').select('Jedzenie');

    cy.get('#expenseList').should('contain', 'Pizza');
    cy.get('#expenseList').should('not.contain', 'Prąd');
  });

  it('zachowuje dane po odświeżeniu strony dzięki localStorage', () => {
    cy.get('#name').type('Internet');
    cy.get('#amount').type('80');
    cy.get('#category').select('Rachunki');
    cy.contains('Dodaj wydatek').click();

    cy.reload();

    cy.get('#expenseList').should('contain', 'Internet');
    cy.get('#totalAmount').should('have.text', '80.00 zł');
  });
});
