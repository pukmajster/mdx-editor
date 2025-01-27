/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as Popover from '@radix-ui/react-popover'
import * as Tooltip from '@radix-ui/react-tooltip'
import React from 'react'

import { activeEditor$, editorRootElementRef$, iconComponentFor$ } from '../core'
import { DownshiftAutoComplete } from '../core/ui/DownshiftAutoComplete'
import styles from '@/styles/ui.module.css'
import classNames from 'classnames'
import { createCommand, LexicalCommand } from 'lexical'
import { useForm } from 'react-hook-form'
import {
  cancelLinkEdit$,
  linkAutocompleteSuggestions$,
  linkDialogState$,
  onWindowChange$,
  removeLink$,
  switchFromPreviewToLinkEdit$,
  updateLink$,
  onClickLinkCallback$
} from '.'
import { useCellValues, usePublisher } from '@mdxeditor/gurx'
import { useI18n } from '@/plugins/core/i18n'

export const OPEN_LINK_DIALOG: LexicalCommand<undefined> = createCommand()

interface LinkEditFormProps {
  url: string
  title: string
  onSubmit: (link: { url: string; title: string }) => void
  onCancel: () => void
  linkAutocompleteSuggestions: string[]
}

interface LinkFormFields {
  url: string
  title: string
}

export function LinkEditForm({ url, title, onSubmit, onCancel, linkAutocompleteSuggestions }: LinkEditFormProps) {
  const i18n = useI18n()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset: _
  } = useForm<LinkFormFields>({
    values: {
      url,
      title
    }
  })

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e)
        e.stopPropagation()
        e.preventDefault()
      }}
      onReset={(e) => {
        e.stopPropagation()
        onCancel()
      }}
      className={classNames(styles.multiFieldForm, styles.linkDialogEditForm)}
    >
      <div className={styles.formField}>
        <label htmlFor="link-url">{i18n.createLink.url}</label>
        <DownshiftAutoComplete
          register={register}
          initialInputValue={url}
          inputName="url"
          suggestions={linkAutocompleteSuggestions}
          setValue={setValue}
          control={control}
          placeholder={i18n.createLink.urlPlaceholder}
          autofocus
        />
      </div>

      <div className={styles.formField}>
        <label htmlFor="link-title">{i18n.createLink.title}</label>
        <input id="link-title" className={styles.textInput} size={40} {...register('title')} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)' }}>
        <button
          type="submit"
          title={i18n.createLink.saveTooltip}
          aria-label={i18n.createLink.title}
          className={classNames(styles.primaryButton)}
        >
          {i18n.dialogControls.save}
        </button>
        <button
          type="reset"
          title={i18n.createLink.cancelTooltip}
          aria-label={i18n.createLink.title}
          className={classNames(styles.secondaryButton)}
        >
          {i18n.dialogControls.cancel}
        </button>
      </div>
    </form>
  )
}

/** @internal */
export const LinkDialog: React.FC = () => {
  const i18n = useI18n()
  const [editorRootElementRef, activeEditor, iconComponentFor, linkDialogState, linkAutocompleteSuggestions, onClickLinkCallback] =
    useCellValues(
      editorRootElementRef$,
      activeEditor$,
      iconComponentFor$,
      linkDialogState$,
      linkAutocompleteSuggestions$,
      onClickLinkCallback$
    )
  const publishWindowChange = usePublisher(onWindowChange$)
  const updateLink = usePublisher(updateLink$)
  const cancelLinkEdit = usePublisher(cancelLinkEdit$)
  const switchFromPreviewToLinkEdit = usePublisher(switchFromPreviewToLinkEdit$)
  const removeLink = usePublisher(removeLink$)

  React.useEffect(() => {
    const update = () => {
      activeEditor?.getEditorState().read(() => {
        publishWindowChange(true)
      })
    }

    window.addEventListener('resize', update)
    window.addEventListener('scroll', update)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update)
    }
  }, [activeEditor, publishWindowChange])

  const [copyUrlTooltipOpen, setCopyUrlTooltipOpen] = React.useState(false)

  const theRect = linkDialogState?.rectangle

  const urlIsExternal = linkDialogState.type === 'preview' && linkDialogState.url.startsWith('http')

  return (
    <Popover.Root open={linkDialogState.type !== 'inactive'}>
      <Popover.Anchor
        data-visible={linkDialogState.type === 'edit'}
        className={styles.linkDialogAnchor}
        style={{
          top: `${theRect?.top ?? 0}px`,
          left: `${theRect?.left ?? 0}px`,
          width: `${theRect?.width ?? 0}px`,
          height: `${theRect?.height ?? 0}px`
        }}
      />

      <Popover.Portal container={editorRootElementRef?.current}>
        <Popover.Content
          className={classNames(styles.linkDialogPopoverContent)}
          sideOffset={5}
          onOpenAutoFocus={(e) => e.preventDefault()}
          key={linkDialogState.linkNodeKey}
        >
          {linkDialogState.type === 'edit' && (
            <LinkEditForm
              url={linkDialogState.url}
              title={linkDialogState.title}
              onSubmit={updateLink}
              onCancel={cancelLinkEdit.bind(null)}
              linkAutocompleteSuggestions={linkAutocompleteSuggestions}
            />
          )}

          {linkDialogState.type === 'preview' && (
            <>
              <a
                className={styles.linkDialogPreviewAnchor}
                href={linkDialogState.url}
                {...(urlIsExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={(e) => {
                  if (onClickLinkCallback !== null) {
                    e.preventDefault()
                    onClickLinkCallback(linkDialogState.url)
                  }
                }}
                title={urlIsExternal ? i18n.linkPreview.open.replace('$url', linkDialogState.url) : linkDialogState.url}
              >
                <span>{linkDialogState.url}</span>
                {urlIsExternal && iconComponentFor('open_in_new')}
              </a>

              <ActionButton onClick={() => switchFromPreviewToLinkEdit()} title={i18n.linkPreview.edit} aria-label={i18n.linkPreview.edit}>
                {iconComponentFor('edit')}
              </ActionButton>

              <Tooltip.Provider>
                <Tooltip.Root open={copyUrlTooltipOpen}>
                  <Tooltip.Trigger asChild>
                    <ActionButton
                      title={i18n.linkPreview.copyToClipboard}
                      aria-label={i18n.linkPreview.copyToClipboard}
                      onClick={() => {
                        void window.navigator.clipboard.writeText(linkDialogState.url).then(() => {
                          setCopyUrlTooltipOpen(true)
                          setTimeout(() => setCopyUrlTooltipOpen(false), 1000)
                        })
                      }}
                    >
                      {copyUrlTooltipOpen ? iconComponentFor('check') : iconComponentFor('content_copy')}
                    </ActionButton>
                  </Tooltip.Trigger>
                  <Tooltip.Portal container={editorRootElementRef?.current}>
                    <Tooltip.Content className={classNames(styles.tooltipContent)} sideOffset={5}>
                      {i18n.linkPreview.copied}
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>

              <ActionButton title={i18n.linkPreview.remove} aria-label={i18n.linkPreview.remove} onClick={() => removeLink()}>
                {iconComponentFor('link_off')}
              </ActionButton>
            </>
          )}
          <Popover.Arrow className={styles.popoverArrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

const ActionButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(({ className, ...props }, ref) => {
  return <button className={classNames(styles.actionButton, className)} ref={ref} {...props} />
})
