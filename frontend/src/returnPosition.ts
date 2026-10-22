/**
 * Where the participant was on the catalog when they opened an entry, so returning
 * puts them back at the same scroll position with focus on that card (FR-1.4).
 */
export const returnPosition = {
  scrollY: 0,
  openedId: null as string | null,
};

/** Router state set on catalog links, telling the detail view it can go back in history. */
export interface FromCatalogState {
  fromCatalog: true;
}
