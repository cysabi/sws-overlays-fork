import { InjectionKey, provide, inject, getCurrentInstance } from 'vue';

interface RawTransitions {
    beforeEnter?: (elem: HTMLElement) => void
    enter?: (elem: HTMLElement, done: gsap.Callback, ...args: unknown[]) => void
    beforeLeave?: (elem: HTMLElement) => void
    leave?: (elem: HTMLElement, done: gsap.Callback, ...args: unknown[]) => void
}

export interface Transitions {
    beforeEnter: (elem: HTMLElement) => void
    enter: (elem: HTMLElement, done: gsap.Callback, ...args: unknown[]) => void
    beforeLeave: (elem: HTMLElement) => void
    leave: (elem: HTMLElement, done: gsap.Callback, ...args: unknown[]) => void
}

export type TransitionMap = Record<string, Transitions>;

export const TransitionMapInjectionKey = Symbol() as InjectionKey<TransitionMap>;

export function createTransitionMap() {
    const map: TransitionMap = {};
    provide(TransitionMapInjectionKey, map);
    return map;
}

export function provideTransitionMapMember(transitions: RawTransitions) {
    const key = getCurrentInstance()?.type.__name;
    if (key == null) {
        throw new Error('Could not determine component name');
    }

    const injection = inject(TransitionMapInjectionKey);
    if (injection == null) {
        console.warn('no transition map to provide for');
        return;
    }

    injection[key] = normalizeTransitionFunctions(transitions);
}

function normalizeTransitionFunctions(transitions: RawTransitions): Transitions {
    return {
        beforeEnter: transitions.beforeEnter ?? (() => {}),
        enter: transitions.enter ?? ((_, done) => done()),
        beforeLeave: transitions.beforeLeave ?? (() => { }),
        leave: transitions.leave ?? ((_, done) => done())
    };
}
