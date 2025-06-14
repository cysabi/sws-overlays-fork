import { InjectionKey, provide, inject, Ref, getCurrentInstance } from 'vue';
import gsap from 'gsap';

interface RawTransitions {
    beforeEnter?: (elem: HTMLElement) => void
    enter?: (elem: HTMLElement, done: gsap.Callback | undefined, ...args: unknown[]) => gsap.core.Timeline
    beforeLeave?: (elem: HTMLElement) => void
    leave?: (elem: HTMLElement, done: gsap.Callback | undefined, ...args: unknown[]) => gsap.core.Timeline
}

export interface Transitions {
    beforeEnter: () => void
    enter: (...args: unknown[]) => gsap.core.Timeline
    beforeLeave: () => void
    leave: (...args: unknown[]) => gsap.core.Timeline
}

export type TransitionMap = Record<string, Transitions>;

export const TransitionMapInjectionKey = Symbol() as InjectionKey<TransitionMap>;

export function createTransitionMap() {
    const map: TransitionMap = {};
    provide(TransitionMapInjectionKey, map);
    return map;
}

export function provideTransitionMapMember(elementRef: Ref<HTMLElement | null>, transitions: RawTransitions) {
    const key = getCurrentInstance()?.type.__name;
    if (key == null) {
        throw new Error('Could not determine component name');
    }

    const injection = inject(TransitionMapInjectionKey);
    if (injection == null) {
        console.warn('no transition map to provide for');
        return;
    }

    injection[key] = normalizeTransitionFunctions(elementRef, transitions);
}

export function initLazyTransitionMapMember(elementRef: Ref<HTMLElement | null>): Transitions {
    const key = getCurrentInstance()?.type.__name;
    if (key == null) {
        throw new Error('Could not determine component name');
    }

    const injection = inject(TransitionMapInjectionKey);
    if (injection == null) {
        throw new Error('no transition map to provide for');
    }

    const result = normalizeTransitionFunctions(elementRef, {});
    injection[key] = result;
    return result;
}

export function fillLazyTransitionMapMember(initializedTransitions: Transitions, newTransitions: RawTransitions) {
    Object.entries(newTransitions).filter(([_, value]) => value != null).forEach(([key, value]) => {
        // @ts-ignore: i don't want to deal with this
        initializedTransitions[key] = value;
    });
}

function normalizeTransitionFunctions(elementRef: Ref<HTMLElement | null>, transitions: RawTransitions): Transitions {
    return {
        beforeEnter: () => {
            if (!transitions.beforeEnter || !elementRef.value) return;
            transitions.beforeEnter(elementRef.value);
        },
        enter: (...args: unknown[]) => {
            if (!transitions.enter || !elementRef.value) return gsap.timeline();
            return transitions.enter(elementRef.value, undefined, ...args);
        },
        beforeLeave: () => {
            if (!transitions.beforeLeave || !elementRef.value) return;
            transitions.beforeLeave(elementRef.value);
        },
        leave: (...args: unknown[]) => {
            if (!transitions.leave || !elementRef.value) return gsap.timeline();
            return transitions.leave(elementRef.value, undefined, ...args);
        }
    };
}
