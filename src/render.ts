import ReactReconciler from 'react-reconciler';
import { Root } from './root';
import { Arc } from './arc';
import { Group } from './group';
import { Rect } from './rect';
import { Path } from './path';
import { Image } from './image';
import { Text } from './text';
import type * as C from './index';
import type { Entity } from './entity';

type CanvasRoot = { getContext: (type: '2d') => any };

type Components = {
	Arc: C.ArcProps;
	Group: C.GroupProps;
	Image: C.ImageProps;
	Path: C.PathProps;
	Rect: C.RectProps;
	Text: C.TextProps;
	//Line: C.LineProps;
	//Circle: C.CircleProps;
	//Triangle: C.TriangleProps;
	//Text: C.TextProps;
	//Path: C.PathProps;
	//Image: C.ImageProps;
};

interface HostContext {}

type Container = Root;

type Instance = Entity;

type Type = keyof Components;

type Props = Components[Type];

type TypeWithProps<T extends Type> = {
	type: T;
	props: Components[T];
	newProps?: Components[T];
};

type PartialUnion<T> = T extends any ? Partial<T> : never;

type UpdatePayload = PartialUnion<Props> | null;

const is = <T extends Type>(
	type: T,
	t: TypeWithProps<Type>,
): t is TypeWithProps<T> => {
	return type === t.type;
};

//const getText = ({ children: c }: C.TextProps) => {
//	if (c === null || typeof c === 'undefined') return '';
//	return Array.isArray(c) ? c.map(String).join('') : String(c);
//};

function assertIsGroup(v: any): asserts v is Group {
	if (!(v && v instanceof Group)) {
		throw new Error('Expected Group');
	}
}

const getText = ({ children: c }: C.TextProps) => {
	if (c === null || typeof c === 'undefined') return '';
	return Array.isArray(c) ? c.map(String).join('') : String(c);
};

const reconciler = ReactReconciler<
	Type,
	Props,
	Container,
	Instance,
	never /*TextInstance*/,
	never /*SuspenseInstance*/,
	never /*HydratableInstance*/,
	Instance /*PublicInstance*/,
	HostContext,
	UpdatePayload,
	never /*ChildSet*/,
	number /*TimeoutHandle*/,
	number /*NoTimeout*/
>({
	supportsHydration: false,
	supportsMutation: true,
	supportsPersistence: false,
	createInstance(type, props, root) {
		const t = { type, props };
		//console.log('createInstance', t);
		if (is('Group', t)) {
			return new Group(t.props);
		} else if (is('Arc', t)) {
			return new Arc(t.props);
		} else if (is('Image', t)) {
			return new Image(t.props);
		} else if (is('Path', t)) {
			return new Path(t.props);
		} else if (is('Rect', t)) {
			return new Rect(t.props);
		} else if (is('Text', t)) {
			return new Text({ ...t.props, value: getText(t.props) });
		}
		throw new Error(`Unsupported type: ${type}`);
	},
	createTextInstance(text, root) {
		//console.log('createTextInstance', { text, root });
		throw new Error('Text must be placed inside of a <Text> component');
	},
	appendInitialChild(parentInstance, child) {
		//console.log("appendInitialChild", { parentInstance, child });
		assertIsGroup(parentInstance);
		parentInstance.subroot.add(child);
		parentInstance.root?.queueRender();
	},
	appendChild(parentInstance, child) {
		//console.log('appendChild', { parentInstance, child });
		assertIsGroup(parentInstance);
		parentInstance.subroot.add(child);
		parentInstance.root?.queueRender();
	},
	appendChildToContainer(container, child) {
		//console.log("appendChildToContainer", { child });
		container.add(child);
		container.queueRender();
	},
	insertBefore(parentInstance, child, beforeChild) {
		//console.log("insertBefore", {
		//	parentInstance,
		//	child,
		//	beforeChild,
		//});
		assertIsGroup(parentInstance);
		parentInstance.subroot.insertBefore(child, beforeChild);
		parentInstance.root?.queueRender();
	},
	insertInContainerBefore(root, child, beforeChild) {
		//console.log("insertInContainerBefore", { child, beforeChild });
		root.insertBefore(child, beforeChild);
		root.queueRender();
	},
	removeChild(parentInstance, child) {
		//console.log("removeChild", { parentInstance, child });
		assertIsGroup(parentInstance);
		parentInstance.subroot.remove(child);
		parentInstance.subroot.queueRender();
	},
	removeChildFromContainer(root, child) {
		//console.log("removeChildFromContainer", { child });
		root.remove(child);
		root.queueRender();
	},
	finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
		return false;
	},
	prepareUpdate(
		instance,
		type,
		oldProps,
		newProps,
		rootContainer,
		hostContext,
	) {
		//console.log("prepareUpdate", { instance, type, oldProps, newProps });
		//throw new Error("prepareUpdate");
		let payload: UpdatePayload = null;
		//const t = { type, props: oldProps, newProps };
		//if (is("Canvas", t) || is("StaticCanvas", t)) {
		//} else {
		for (const k of Object.keys(newProps)) {
			if (k === 'children') continue;
			// @ts-expect-error
			if (oldProps[k] !== newProps[k]) {
				if (!payload) payload = {};
				// @ts-expect-error
				payload[k] = newProps[k];
			}
		}
		if (type === 'Text') {
			const newValue = getText(newProps as C.TextProps);
			if ((instance as Text).value !== newValue) {
				if (!payload) payload = {};
				// @ts-expect-error
				payload.value = newValue;
			}
		}
		//	if (is("Text", t)) {
		//		const oldText = getText(t.props);
		//		const newText = getText(t.newProps);
		//		if (oldText !== newText) {
		//			if (!payload) payload = {};
		//			// @ts-expect-error
		//			payload.text = newText;
		//		}
		//	}
		//}
		return payload;
	},
	commitUpdate(instance, payload) {
		//console.log("commitUpdate", { instance, payload });
		Object.assign(instance, payload);
		if (instance.root) {
			instance.root.queueRender();
		}
	},
	commitTextUpdate(instance, oldText, newText) {
		console.log('commitTextUpdate', { instance, oldText, newText });
		//instance.set("text", newText);
		//instance.canvas?.requestRenderAll();
	},
	clearContainer(container) {
		//console.log("clearContainer");
		container.clear();
	},
	shouldSetTextContent(type, props) {
		//console.log("shouldSetTextContent", { type, props });
		return type === 'Text';
	},
	resetTextContent(instance) {
		console.log('resetTextContent', { instance });
		//if (instance instanceof fabric.Text) {
		//	instance.set("text", "");
		//} else if (instance instanceof fabric.StaticCanvas) {
		//	throw new Error(`Canvas can not reset text content`);
		//} else {
		//	throw new Error(
		//		`Type "${instance.type}" can not reset text content`,
		//	);
		//}
	},
	getRootHostContext(rootContainer) {
		return null;
	},
	getChildHostContext(parentHostContext, type, rootContainer) {
		return parentHostContext;
	},
	getPublicInstance(instance) {
		return instance;
	},
	prepareForCommit(containerInfo) {
		return null;
	},
	resetAfterCommit(containerInfo) {},
	preparePortalMount: function (containerInfo: unknown): void {
		throw new Error('Function not implemented.');
	},
	scheduleTimeout(
		fn: (...args: unknown[]) => unknown,
		delay?: number | undefined,
	) {
		return setTimeout(fn, delay) as unknown as number;
	},
	cancelTimeout(id) {
		clearTimeout(id);
	},
	noTimeout: -1,
	isPrimaryRenderer: false,
	getCurrentEventPriority() {
		throw new Error('Function not implemented.');
	},
	getInstanceFromNode(node) {
		throw new Error('Function not implemented.');
	},
	beforeActiveInstanceBlur() {
		throw new Error('Function not implemented.');
	},
	afterActiveInstanceBlur() {
		throw new Error('Function not implemented.');
	},
	prepareScopeUpdate(scopeInstance, instance) {
		throw new Error('Function not implemented.');
	},
	getInstanceFromScope(scopeInstance) {
		throw new Error('Function not implemented.');
	},
	detachDeletedInstance(instance) {
		//console.log("detachDeletedInstance", instance);
	},
});

export function render(app: React.JSX.Element, canvas: CanvasRoot) {
	const ctx = canvas.getContext('2d');
	const root = new Root(ctx);
	(window as any).root = root;
	// @ts-expect-error I don't know that's supposed to be passed here…
	const container = reconciler.createContainer(root, false, false);
	reconciler.updateContainer(
		app /*createElement(FabricContext.Provider, { value: fabric }, app) */,
		container,
		null,
		null,
	);
}
