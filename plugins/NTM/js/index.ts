import { getModules } from '@valenced/modules/finders';
import { withProps } from '@valenced/modules/finders/filters';
import { instead } from '@valenced/patcher';

type Handlers = { handleTapUsername: (...args: any[]) => any };

export default plugin({
  start({ cleanup, plugin: instance }) {
    const patched = new WeakSet<object>();
    const attach = (target: Partial<Handlers> | undefined) => {
      if (!target || patched.has(target) || typeof target.handleTapUsername !== 'function') return;
      patched.add(target);
      cleanup(instead(target as Handlers, 'handleTapUsername', () => undefined));
    };
    cleanup(getModules(withProps<Handlers>('handleTapUsername'), attach));
    cleanup(getModules(withProps<{ prototype: Handlers }>('prototype'), value => attach(value.prototype)));
    if (instance.startedLate) instance.requireReload();
  },
});
