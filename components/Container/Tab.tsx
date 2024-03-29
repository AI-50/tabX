import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"

import Favicon from "~components/Favicon"
import { getI18nByKey } from "~i18n"
import { appStateStore } from "~store"
import type { TTab } from "~types/browser"
import { ETabMode } from "~types/common"
import { getPagePreviewDataUrlByTabId, openSelectedTabs } from "~utils/tabs"

import TabAction from "./TabAction"

interface IProps {
  tab: TTab
}
export default function ({ tab }: IProps) {
  const appState = useAtomValue(appStateStore)
  const [previewDataUrl, setPreviewDataUrl] = useState<string>("")

  const failedMessage = getI18nByKey("failedToPreview")
  const inactiveMsg = getI18nByKey("inactive")

  useEffect(() => {
    if (appState.tabMode === ETabMode.pagePreview) {
      getPagePreviewDataUrlByTabId(tab.id).then((dataUrl) => {
        setPreviewDataUrl(dataUrl)
      })
    }
  }, [appState.tabMode])

  if (appState.tabMode === ETabMode.listView) {
    return (
      <div className="flex gap-2 items-center p-1 rounded-sm bg-white hover:bg-blue-500 hover:text-white transition-all mr-4 group">
        <Favicon url={tab.url} />
        <div className="truncate max-w-[420px]">{tab.title}</div>
        <TabAction tab={tab} />
      </div>
    )
  }
  // preview mode
  return (
    <div className="inline-block bg-white m-2 min-w-[340px] max-w-[340px] h-[160px] overflow-hidden border border-gray-100 rounded-md group relative">
      <div className="p-1 px-2 bg-gray-100 flex justify-between items-center">
        <a href={tab.url} target="_blank" className="flex items-center">
          <Favicon url={tab.url} styles={{ width: "16px", height: "16px" }} />
        </a>
        <div className="truncate max-w-[75%]">{tab.title}</div>
      </div>
      <div className="absolute bottom-0 p-2 flex justify-center left-0 right-0">
        <TabAction tab={tab} isPreview={true} />
      </div>
      <div className="p-1 cursor-pointer" onClick={() => openSelectedTabs(tab)}>
        {previewDataUrl ? (
          <img src={previewDataUrl} className="w-full h-[120px]" />
        ) : (
          <div className="flex justify-center items-center h-[120px] text-gray-400">
            {failedMessage}
            {tab.active ? "" : `(${inactiveMsg})`}
          </div>
        )}
      </div>
    </div>
  )
}
