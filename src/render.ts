import { createElement } from 'react';
import ReactReconciler from 'react-reconciler';
import { Root, type RootParams } from './root.js';
import { Arc } from './arc.js';
import { Canvas } from './canvas.js';
import { Ellipse } from './ellipse.js';
import { Group } from './group.js';
import { Line } from './line.js';
import { Rect } from './rect.js';
import { RoundRect } from './round-rect.js';
import { Path } from './path.js';
import { Image } from './image.js';
import { Text } from './text.js';
import { Entity } from './entity.js';
import { ParentContext } from './hooks/use-parent.js';
import type * as C from './index.js';
import type { ICanvas } from './types.js';

type Components = {
	Arc: C.ArcProps;
	Canvas: C.CanvasProps;
	Ellipse: C.EllipseProps;
	Group: C.GroupProps;
	Image: C.ImageProps;
	Line: C.LineProps;
	Path: C.PathProps;
	Rect: C.RectProps;
	RoundRect: C.RoundRectProps;
	Text: C.TextProps;
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

function assertIsGroup(v: any): asserts v is Group {
	if (!(v && v instanceof Group)) {
		throw new Error('Expected Group');
	}
}

const getText = ({ children: c }: C.TextProps) => {
	if (c == null) return '';
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
		//console.log('createInstance', t, root);
		if (is('Group', t)) {
			// @ts-expect-error "root" is missing from the type, but definitely gets passed in from the <Group> component
			return new Group(t.props);
		}
		if (is('Arc', t)) {
			return new Arc(t.props);
		}
		if (is('Canvas', t)) {
			return new Canvas(t.props, root);
		}
		if (is('Ellipse', t)) {
			return new Ellipse(t.props);
		}
		if (is('Image', t)) {
			return new Image(t.props, root);
		}
		if (is('Line', t)) {
			return new Line(t.props);
		}
		if (is('Path', t)) {
			return new Path(t.props);
		}
		if (is('Rect', t)) {
			return new Rect(t.props);
		}
		if (is('RoundRect', t)) {
			return new RoundRect(t.props);
		}
		if (is('Text', t)) {
			return new Text({ ...t.props, value: getText(t.props) });
		}
		throw new Error(`Unsupported type: ${type}`);
	},
	createTextInstance(text, root) {
		console.log('createTextInstance', { text, root });
		throw new Error('Text must be placed inside of a <Text> component');
	},
	appendInitialChild(parentInstance, child) {
		//console.log("appendInitialChild", { parentInstance, child });
		assertIsGroup(parentInstance);
		parentInstance.subroot.add(child);
		parentInstance._root?.queueRender();
	},
	appendChild(parentInstance, child) {
		//console.log('appendChild', { parentInstance, child });
		assertIsGroup(parentInstance);
		parentInstance.subroot.add(child);
		parentInstance._root?.queueRender();
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
		parentInstance._root?.queueRender();
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
				const prop = /^on[A-Z]/.test(k) ? k.toLowerCase() : k;
				// @ts-expect-error
				payload[prop] = newProps[k];
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
		instance._root?.queueRender();
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
	preparePortalMount(containerInfo: unknown) {
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
	hideInstance(instance) {
		//console.log('hideInstance', { instance});
		instance._hidden = true;
	},
	unhideInstance(instance, props) {
		//console.log('unhideInstance', { instance, props });
		instance._hidden = false;
	},
});

reconciler.injectIntoDevTools({
	bundleType: true ? 1 : 0,
	rendererPackageName: 'react-tela',
	version: '0.0.0',
});

export function render(
	app: React.JSX.Element,
	canvas: ICanvas,
	opts?: RootParams,
) {
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new TypeError(`canvas.getContext('2d') returned: ${ctx}`);
	}
	const root = new Root(ctx, opts);

	// TODO: remove
	(globalThis as any).root = root;

	// @ts-expect-error - I don't know what is supposed to go here…
	const container = reconciler.createContainer(root, false, false);

	reconciler.updateContainer(
		createElement(ParentContext.Provider, { value: root }, app),
		container,
		null /* parentComponent */,
		null /* callback */,
	);

	return root;
}
