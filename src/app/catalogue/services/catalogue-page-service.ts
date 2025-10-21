import { Injectable } from "@angular/core";
import { Catalogue } from "../model/catalogue-modal";

@Injectable({
  providedIn: 'root'
})
export class CataloguePageService {
    private loadedCatalogue: Catalogue | null = null;
    private loadedFormMode!: string;

    constructFormMode(formMode: string) {
        this.loadedFormMode = formMode;
    }

    constructCatalogueValue(catalogue: Catalogue | undefined | null) {
        if (catalogue) {
            this.loadedCatalogue = catalogue;
        } else {
            // create new catalogue
        }
    }

    updateCatalogue(catalogue: Catalogue) {
        this.loadedCatalogue = catalogue;
    }

    get formMode(): string {
        return this.loadedFormMode;
    }

    get catalogue(): Catalogue | null {
        return this.loadedCatalogue;
    }

}