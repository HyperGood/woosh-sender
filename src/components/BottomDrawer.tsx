import { Drawer } from "vaul";
import { cn } from "~/utils/cn";

export function BottomDrawerTrigger({
  className,
  title,
}: {
  className?: string;
  title: string;
}) {
  return <Drawer.Trigger className={className}>{title}</Drawer.Trigger>;
}

export function BottomDrawerTitle({
  className,
  title,
}: {
  className?: string;
  title: string;
}) {
  return (
    <Drawer.Title className={cn("mb-2 w-full text-left text-2xl", className)}>
      {title}
    </Drawer.Title>
  );
}

type DrawerRootProps = Parameters<typeof Drawer.Root>[0];

export interface BottomDrawerProps extends DrawerRootProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
}

export function BottomDrawer(props: BottomDrawerProps) {
  const { content, trigger } = props;
  return (
    <Drawer.Root {...props}>
      {trigger}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 flex flex-col rounded-t-[32px] bg-white p-4">
          <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
          <div className="mx-auto max-w-md">{content}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
