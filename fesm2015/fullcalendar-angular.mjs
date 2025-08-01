import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, Input, ViewChild, ContentChild, NgModule } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import { CustomRenderingStore } from '@fullcalendar/core/internal';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

const OPTION_IS_DEEP = {
    headerToolbar: true,
    footerToolbar: true,
    events: true,
    eventSources: true,
    resources: true
};
/*
NOTE: keep synced with component
*/
const OPTION_INPUT_NAMES = [
    'events',
    'eventSources',
    'resources',
];

const hasOwnProperty = Object.prototype.hasOwnProperty;
/*
Really simple clone utility. Only copies plain arrays, objects, and Dates. Transfers everything else as-is.
Wanted to use a third-party lib, but none did exactly this.
*/
function deepCopy(input) {
    if (Array.isArray(input)) {
        return input.map(deepCopy);
    }
    else if (input instanceof Date) {
        return new Date(input.valueOf());
    }
    else if (typeof input === 'object' && input) { // non-null object
        return mapHash(input, deepCopy);
    }
    else { // everything else (null, function, etc)
        return input;
    }
}
function mapHash(input, func) {
    const output = {};
    for (const key in input) {
        if (hasOwnProperty.call(input, key)) {
            output[key] = func(input[key], key);
        }
    }
    return output;
}

/*
Forked from https://github.com/epoberezkin/fast-deep-equal (also has MIT license)
Needed ESM support or else Angular complains about treeshaking
(https://github.com/fullcalendar/fullcalendar-angular/issues/421)
*/
function deepEqual(a, b) {
    if (a === b)
        return true;
    if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor)
            return false;
        var length, i, keys;
        if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length)
                return false;
            for (i = length; i-- !== 0;)
                if (!deepEqual(a[i], b[i]))
                    return false;
            return true;
        }
        if (a.constructor === RegExp)
            return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf)
            return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString)
            return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length)
            return false;
        for (i = length; i-- !== 0;)
            if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
                return false;
        for (i = length; i-- !== 0;) {
            var key = keys[i];
            if (!deepEqual(a[key], b[key]))
                return false;
        }
        return true;
    }
    // true if both NaN, false otherwise
    return a !== a && b !== b;
}

const dummyContainer$1 = typeof document !== 'undefined' ? document.createDocumentFragment() : null;
class OffscreenFragmentComponent {
    constructor(element) {
        this.element = element;
    }
    ngAfterViewInit() {
        if (dummyContainer$1) {
            dummyContainer$1.appendChild(this.element.nativeElement);
        }
    }
    // invoked BEFORE component removed from DOM
    ngOnDestroy() {
        if (dummyContainer$1) {
            dummyContainer$1.removeChild(this.element.nativeElement);
        }
    }
}
OffscreenFragmentComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: OffscreenFragmentComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
OffscreenFragmentComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.12", type: OffscreenFragmentComponent, selector: "offscreen-fragment", ngImport: i0, template: '<ng-content></ng-content>', isInline: true, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: OffscreenFragmentComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'offscreen-fragment',
                    template: '<ng-content></ng-content>',
                    encapsulation: ViewEncapsulation.None
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; } });

const dummyContainer = typeof document !== 'undefined' ? document.createDocumentFragment() : null;
class TransportContainerComponent {
    ngAfterViewInit() {
        var _a;
        const rootEl = (_a = this.rootElRef) === null || _a === void 0 ? void 0 : _a.nativeElement; // assumed defined
        replaceEl(rootEl, this.inPlaceOf);
        applyElAttrs(rootEl, undefined, this.elAttrs);
        // insurance for if Preact recreates and reroots inPlaceOf element
        this.inPlaceOf.style.display = 'none';
        this.reportEl(rootEl);
    }
    ngOnChanges(changes) {
        var _a;
        const rootEl = (_a = this.rootElRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        // ngOnChanges is called before ngAfterViewInit (and before DOM initializes)
        // so make sure rootEl is defined before doing anything
        if (rootEl) {
            // If the ContentContainer's tagName changed, it will create a new DOM element in its
            // original place. Detect this and re-replace.
            if (this.inPlaceOf.parentNode !== dummyContainer) {
                replaceEl(rootEl, this.inPlaceOf);
                applyElAttrs(rootEl, undefined, this.elAttrs);
                this.reportEl(rootEl);
            }
            else {
                const elAttrsChange = changes['elAttrs'];
                if (elAttrsChange) {
                    applyElAttrs(rootEl, elAttrsChange.previousValue, elAttrsChange.currentValue);
                }
            }
        }
    }
    // invoked BEFORE component removed from DOM
    ngOnDestroy() {
        if (
        // protect against Preact recreating and rerooting inPlaceOf element
        this.inPlaceOf.parentNode === dummyContainer &&
            dummyContainer) {
            dummyContainer.removeChild(this.inPlaceOf);
        }
        this.reportEl(null);
    }
}
TransportContainerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: TransportContainerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
TransportContainerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.12", type: TransportContainerComponent, selector: "transport-container", inputs: { inPlaceOf: "inPlaceOf", reportEl: "reportEl", elTag: "elTag", elClasses: "elClasses", elStyle: "elStyle", elAttrs: "elAttrs", template: "template", renderProps: "renderProps" }, viewQueries: [{ propertyName: "rootElRef", first: true, predicate: ["rootEl"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<ng-template [ngIf]=\"elTag == 'div'\">\n  <div #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </div>\n</ng-template>\n<ng-template [ngIf]=\"elTag == 'span'\">\n  <span #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </span>\n</ng-template>\n<ng-template [ngIf]=\"elTag == 'a'\">\n  <a #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </a>\n</ng-template>\n<ng-template [ngIf]=\"elTag == 'tr'\">\n  <tr #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </tr>\n</ng-template>\n<ng-template [ngIf]=\"elTag == 'th'\">\n  <th #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </th>\n</ng-template>\n<ng-template [ngIf]=\"elTag == 'td'\">\n  <td #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </td>\n</ng-template>\n", directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: TransportContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'transport-container', encapsulation: ViewEncapsulation.None, template: "<ng-template [ngIf]=\"elTag == 'div'\">\n  <div #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </div>\n</ng-template>\n<ng-template [ngIf]=\"elTag == 'span'\">\n  <span #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </span>\n</ng-template>\n<ng-template [ngIf]=\"elTag == 'a'\">\n  <a #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </a>\n</ng-template>\n<ng-template [ngIf]=\"elTag == 'tr'\">\n  <tr #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </tr>\n</ng-template>\n<ng-template [ngIf]=\"elTag == 'th'\">\n  <th #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </th>\n</ng-template>\n<ng-template [ngIf]=\"elTag == 'td'\">\n  <td #rootEl [ngClass]=\"elClasses || ''\" [ngStyle]=\"elStyle || null\">\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngTemplateOutletContext]=\"{ $implicit: renderProps }\"\n    ></ng-container>\n  </td>\n</ng-template>\n" }]
        }], propDecorators: { inPlaceOf: [{
                type: Input
            }], reportEl: [{
                type: Input
            }], elTag: [{
                type: Input
            }], elClasses: [{
                type: Input
            }], elStyle: [{
                type: Input
            }], elAttrs: [{
                type: Input
            }], template: [{
                type: Input
            }], renderProps: [{
                type: Input
            }], rootElRef: [{
                type: ViewChild,
                args: ['rootEl']
            }] } });
function replaceEl(subject, inPlaceOf) {
    var _a;
    (_a = inPlaceOf.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(subject, inPlaceOf.nextSibling);
    if (dummyContainer) {
        dummyContainer.appendChild(inPlaceOf);
    }
}
function applyElAttrs(el, previousAttrs = {}, currentAttrs = {}) {
    // these are called "attributes" but they manipulate DOM node *properties*
    for (const attrName in previousAttrs) {
        if (!(attrName in currentAttrs)) {
            el[attrName] = null;
        }
    }
    for (const attrName in currentAttrs) {
        el[attrName] = currentAttrs[attrName];
    }
}

class FullCalendarComponent {
    constructor(element, changeDetector) {
        this.element = element;
        this.calendar = null;
        this.optionSnapshot = {}; // for diffing
        this.customRenderingMap = new Map();
        const customRenderingStore = new CustomRenderingStore();
        customRenderingStore.subscribe((customRenderingMap) => {
            this.customRenderingMap = customRenderingMap;
            this.customRenderingArray = undefined; // clear cache
            changeDetector.detectChanges();
        });
        this.handleCustomRendering = customRenderingStore.handle.bind(customRenderingStore);
    }
    ngAfterViewInit() {
        const { deepChangeDetection } = this;
        const options = Object.assign(Object.assign({}, this.options), this.buildInputOptions());
        // initialize snapshot
        this.optionSnapshot = mapHash(options, (optionVal, optionName) => ((deepChangeDetection && OPTION_IS_DEEP[optionName])
            ? deepCopy(optionVal)
            : optionVal));
        const calendarEl = this.element.nativeElement;
        const calendar = this.calendar = new Calendar(calendarEl, Object.assign(Object.assign({}, options), this.buildExtraOptions()));
        // Ionic dimensions hack
        // https://github.com/fullcalendar/fullcalendar/issues/4976
        const ionContent = calendarEl.closest('ion-content');
        if (ionContent && ionContent.componentOnReady) {
            ionContent.componentOnReady().then(() => {
                window.requestAnimationFrame(() => {
                    calendar.render();
                });
            });
        }
        else {
            calendar.render();
        }
        // Angular v19, whether because of new Vite dev environment or not,
        // loads outer elements' styles late, so dimensions might not be final here.
        // Force a size-update after a delay.
        setTimeout(() => calendar.updateSize());
    }
    /*
    allows us to manually detect complex input changes, internal mutations to certain options.
    called before ngOnChanges. called much more often than ngOnChanges.
    */
    ngDoCheck() {
        if (this.calendar) { // not the initial render
            const { deepChangeDetection, optionSnapshot } = this;
            const newOptions = Object.assign(Object.assign({}, this.options), this.buildInputOptions());
            const newProcessedOptions = {};
            const changedOptionNames = [];
            // detect adds and updates (and update snapshot)
            for (const optionName in newOptions) {
                if (newOptions.hasOwnProperty(optionName)) {
                    let optionVal = newOptions[optionName];
                    if (deepChangeDetection && OPTION_IS_DEEP[optionName]) {
                        if (!deepEqual(optionSnapshot[optionName], optionVal)) {
                            optionSnapshot[optionName] = deepCopy(optionVal);
                            changedOptionNames.push(optionName);
                        }
                    }
                    else {
                        if (optionSnapshot[optionName] !== optionVal) {
                            optionSnapshot[optionName] = optionVal;
                            changedOptionNames.push(optionName);
                        }
                    }
                    newProcessedOptions[optionName] = optionVal;
                }
            }
            const oldOptionNames = Object.keys(optionSnapshot);
            // detect removals (and update snapshot)
            for (const optionName of oldOptionNames) {
                if (!(optionName in newOptions)) { // doesn't exist in new options?
                    delete optionSnapshot[optionName];
                    changedOptionNames.push(optionName);
                }
            }
            if (changedOptionNames.length) {
                this.calendar.pauseRendering();
                this.calendar.resetOptions(Object.assign(Object.assign({}, newProcessedOptions), this.buildExtraOptions()), changedOptionNames);
            }
        }
    }
    ngAfterContentChecked() {
        if (this.calendar) { // too defensive?
            this.calendar.resumeRendering();
        }
    }
    ngOnDestroy() {
        if (this.calendar) { // too defensive?
            this.calendar.destroy();
            this.calendar = null;
        }
    }
    get customRenderings() {
        return this.customRenderingArray ||
            (this.customRenderingArray = [...this.customRenderingMap.values()]);
    }
    getApi() {
        return this.calendar;
    }
    buildInputOptions() {
        const options = {};
        for (const inputName of OPTION_INPUT_NAMES) {
            const inputValue = this[inputName];
            if (inputValue != null) { // exclude both null and undefined
                options[inputName] = inputValue;
            }
        }
        return options;
    }
    buildExtraOptions() {
        return {
            handleCustomRendering: this.handleCustomRendering,
            customRenderingMetaMap: this,
            customRenderingReplaces: true,
        };
    }
    // for `trackBy` in loop
    trackCustomRendering(index, customRendering) {
        return customRendering.id;
    }
}
FullCalendarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: FullCalendarComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
FullCalendarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.12", type: FullCalendarComponent, selector: "full-calendar", inputs: { options: "options", deepChangeDetection: "deepChangeDetection", events: "events", eventSources: "eventSources", resources: "resources" }, queries: [{ propertyName: "dayHeaderContent", first: true, predicate: ["dayHeaderContent"], descendants: true, static: true }, { propertyName: "dayCellContent", first: true, predicate: ["dayCellContent"], descendants: true, static: true }, { propertyName: "weekNumberContent", first: true, predicate: ["weekNumberContent"], descendants: true, static: true }, { propertyName: "nowIndicatorContent", first: true, predicate: ["nowIndicatorContent"], descendants: true, static: true }, { propertyName: "eventContent", first: true, predicate: ["eventContent"], descendants: true, static: true }, { propertyName: "slotLaneContent", first: true, predicate: ["slotLaneContent"], descendants: true, static: true }, { propertyName: "slotLabelContent", first: true, predicate: ["slotLabelContent"], descendants: true, static: true }, { propertyName: "allDayContent", first: true, predicate: ["allDayContent"], descendants: true, static: true }, { propertyName: "moreLinkContent", first: true, predicate: ["moreLinkContent"], descendants: true, static: true }, { propertyName: "noEventsContent", first: true, predicate: ["noEventsContent"], descendants: true, static: true }, { propertyName: "resourceAreaHeaderContent", first: true, predicate: ["resourceAreaHeaderContent"], descendants: true, static: true }, { propertyName: "resourceGroupLabelContent", first: true, predicate: ["resourceGroupLabelContent"], descendants: true, static: true }, { propertyName: "resourceLabelContent", first: true, predicate: ["resourceLabelContent"], descendants: true, static: true }, { propertyName: "resourceLaneContent", first: true, predicate: ["resourceLaneContent"], descendants: true, static: true }, { propertyName: "resourceGroupLaneContent", first: true, predicate: ["resourceGroupLaneContent"], descendants: true, static: true }], ngImport: i0, template: "<offscreen-fragment>\n  <transport-container *ngFor=\"let customRendering of customRenderings; trackBy:trackCustomRendering\"\n    [inPlaceOf]=\"customRendering.containerEl\"\n    [reportEl]=\"customRendering.reportNewContainerEl\"\n    [elTag]=\"customRendering.elTag\"\n    [elClasses]=\"customRendering.elClasses\"\n    [elStyle]=\"customRendering.elStyle\"\n    [elAttrs]=\"customRendering.elAttrs\"\n    [template]=\"customRendering.generatorMeta\"\n    [renderProps]=\"customRendering.renderProps\"\n  ></transport-container>\n</offscreen-fragment>\n", components: [{ type: OffscreenFragmentComponent, selector: "offscreen-fragment" }, { type: TransportContainerComponent, selector: "transport-container", inputs: ["inPlaceOf", "reportEl", "elTag", "elClasses", "elStyle", "elAttrs", "template", "renderProps"] }], directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: FullCalendarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'full-calendar', encapsulation: ViewEncapsulation.None // the styles are root-level, not scoped within the component
                    ,
                    template: "<offscreen-fragment>\n  <transport-container *ngFor=\"let customRendering of customRenderings; trackBy:trackCustomRendering\"\n    [inPlaceOf]=\"customRendering.containerEl\"\n    [reportEl]=\"customRendering.reportNewContainerEl\"\n    [elTag]=\"customRendering.elTag\"\n    [elClasses]=\"customRendering.elClasses\"\n    [elStyle]=\"customRendering.elStyle\"\n    [elAttrs]=\"customRendering.elAttrs\"\n    [template]=\"customRendering.generatorMeta\"\n    [renderProps]=\"customRendering.renderProps\"\n  ></transport-container>\n</offscreen-fragment>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { options: [{
                type: Input
            }], deepChangeDetection: [{
                type: Input
            }], events: [{
                type: Input
            }], eventSources: [{
                type: Input
            }], resources: [{
                type: Input
            }], dayHeaderContent: [{
                type: ContentChild,
                args: ['dayHeaderContent', { static: true }]
            }], dayCellContent: [{
                type: ContentChild,
                args: ['dayCellContent', { static: true }]
            }], weekNumberContent: [{
                type: ContentChild,
                args: ['weekNumberContent', { static: true }]
            }], nowIndicatorContent: [{
                type: ContentChild,
                args: ['nowIndicatorContent', { static: true }]
            }], eventContent: [{
                type: ContentChild,
                args: ['eventContent', { static: true }]
            }], slotLaneContent: [{
                type: ContentChild,
                args: ['slotLaneContent', { static: true }]
            }], slotLabelContent: [{
                type: ContentChild,
                args: ['slotLabelContent', { static: true }]
            }], allDayContent: [{
                type: ContentChild,
                args: ['allDayContent', { static: true }]
            }], moreLinkContent: [{
                type: ContentChild,
                args: ['moreLinkContent', { static: true }]
            }], noEventsContent: [{
                type: ContentChild,
                args: ['noEventsContent', { static: true }]
            }], resourceAreaHeaderContent: [{
                type: ContentChild,
                args: ['resourceAreaHeaderContent', { static: true }]
            }], resourceGroupLabelContent: [{
                type: ContentChild,
                args: ['resourceGroupLabelContent', { static: true }]
            }], resourceLabelContent: [{
                type: ContentChild,
                args: ['resourceLabelContent', { static: true }]
            }], resourceLaneContent: [{
                type: ContentChild,
                args: ['resourceLaneContent', { static: true }]
            }], resourceGroupLaneContent: [{
                type: ContentChild,
                args: ['resourceGroupLaneContent', { static: true }]
            }] } });

class FullCalendarModule {
}
FullCalendarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: FullCalendarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FullCalendarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: FullCalendarModule, declarations: [FullCalendarComponent,
        OffscreenFragmentComponent,
        TransportContainerComponent], imports: [CommonModule], exports: [FullCalendarComponent] });
FullCalendarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: FullCalendarModule, imports: [[
            CommonModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: FullCalendarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        FullCalendarComponent,
                        OffscreenFragmentComponent,
                        TransportContainerComponent
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        FullCalendarComponent
                    ]
                }]
        }] });

/*
 * Public API Surface of lib
 */

/**
 * Generated bundle index. Do not edit.
 */

export { FullCalendarComponent, FullCalendarModule };
//# sourceMappingURL=fullcalendar-angular.mjs.map
