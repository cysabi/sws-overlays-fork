export type ManagedCanvasTickFunction = (ctx: CanvasRenderingContext2D, delta: number, elapsed: number, time: number) => boolean | void;

export type ManagedCanvasCallbacks = {
    init?: (ctx: CanvasRenderingContext2D) => void,
    tick: ManagedCanvasTickFunction
};

export type ManagedCanvasFallbackFactory = (ctx: CanvasRenderingContext2D) => ManagedCanvasCallbacks;
