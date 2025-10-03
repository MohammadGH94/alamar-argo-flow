-- Allow users to delete their own pipeline responses
CREATE POLICY "Users can delete their own responses" 
ON public.pipeline_responses 
FOR DELETE 
USING (auth.uid() = user_id);