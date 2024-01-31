'use client';
import { useCallback, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import type { Billboard } from '@prisma/client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { AlertModal } from '@/components/modals/alert';
import { ImageUpload } from '@/components/ui/image-upload';

type Props = {
  initialData: Billboard | null;
};

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().url(),
});

type FormValues = z.infer<typeof formSchema>;

export function BillboardForm({ initialData }: Props) {
  const router = useRouter();
  const params = useParams<{ storeId: string; billboardId: string }>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit billboard' : 'Create billboard';
  const description = initialData
    ? 'Edit a billboard'
    : 'Create a new billboard';
  const toastMessage = initialData
    ? 'Billboard updated.'
    : 'Billboard created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { label: '', imageUrl: '' },
  });

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        setLoading(true);
        if (!initialData) {
          await axios.post(`/api/${params.storeId}/billboards`, values);
        } else {
          await axios.patch(
            `/api/${params.storeId}/billboards/${params.billboardId}`,
            values,
          );
        }
        router.refresh();
        router.push(`/${params.storeId}/billboards`);
        toast.success(toastMessage);
      } catch (error) {
        toast.error('Something went wrong.');
      } finally {
        setLoading(false);
      }
    },
    [params, router, initialData, toastMessage],
  );
  const onDelete = useCallback(async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`,
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success('Billboard deleted');
    } catch (error) {
      toast.error(
        'Make sure that you removed all categories using this billboard first.',
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }, [params, router]);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData ? (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
