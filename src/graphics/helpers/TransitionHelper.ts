import { getCurrentInstance, inject, InjectionKey, nextTick, onBeforeMount, provide } from 'vue';

export interface RawTransitions {
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

export function provideTransitionMapMember(transitions: RawTransitions, key?: string) {
    key = key ?? getCurrentInstance()?.type.__name;
    if (key == null) {
        throw new Error('Could not determine component name');
    }

    const injection = inject(TransitionMapInjectionKey);
    if (injection == null) {
        console.warn('no transition map to provide for');
        return;
    }

    // TODO: in overlays, if 1st stage in round is unknown/counterpick, add dropdown to select that stage in begin-next-match dialog

    if (injection[key] == null) {
        injection[key] = normalizeTransitionFunctions(transitions);
    } else {
        // this looks kind of nonsensical, but this was the easiest way i could find to get the injection to be updated
        // after the leave transition finishes and before the enter transition starts, with both sync and async
        // components (using suspense)
        onBeforeMount(() => {
            nextTick(() => {
                injection[key] = normalizeTransitionFunctions(transitions);
            });
        });
    }
}

function normalizeTransitionFunctions(transitions: RawTransitions): Transitions {
    return {
        beforeEnter: transitions.beforeEnter ?? (() => {}),
        enter: transitions.enter ?? ((_, done) => done()),
        beforeLeave: transitions.beforeLeave ?? (() => { }),
        leave: transitions.leave ?? ((_, done) => done())
    };
}
