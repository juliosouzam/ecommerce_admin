'use client';
import { useCallback, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from 'lucide-react';

import type { Store } from '@prisma/client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useStoreModal } from '@/hooks/store';
import { cn } from '@/lib/utils';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type Props = PopoverTriggerProps & {
  items: Store[];
};

export function StoreSwitcher({ className, items = [] }: Props) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId,
  );

  const onStoreSelect = useCallback(
    (store: { value: string; label: string }) => {
      setOpen(false);
      router.push(`/${store.value}`);
    },
    [router],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore ? currentStore.label : 'Select a store'}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onStoreSelect(item)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentStore && currentStore.value === item.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
