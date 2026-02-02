select
  cron.schedule(
    'invoke-sync-zet', -- name of the job
    '0 * * * *',                -- cron schedule (every hour)
    $$
    select
      net.http_post(
        url:='http://127.0.0.1:54321/functions/v1/sync-zet',
        headers:=jsonb_build_object('Content-Type','application/json', 'Authorization','Bearer YOUR_SERVICE_ROLE_KEY'),
        body:=jsonb_build_object('name', 'cron-job')
      );
    $$
  );