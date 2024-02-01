'use client';
import { useCallback, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import type { Size } from '@prisma/client';

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
  initialData: Size | null;
};

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export function SizeForm({ initialData }: Props) {
  const router = useRouter();
  const params = useParams<{ storeId: string; sizeId: string }>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit size' : 'Create size';
  const description = initialData ? 'Edit a size' : 'Create a new size';
  const toastMessage = initialData ? 'Size updated.' : 'Size created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: '', value: '' },
  });

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        setLoading(true);
        if (!initialData) {
          await axios.post(`/api/${params.storeId}/sizes`, values);
        } else {
          await axios.patch(
            `/api/${params.storeId}/sizes/${params.sizeId}`,
            values,
          );
        }
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success('Size deleted');
    } catch (error) {
      toast.error(
        'Make sure that you removed all products using this size first.',
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size value"
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
