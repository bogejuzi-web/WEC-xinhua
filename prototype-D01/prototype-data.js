window.PROTOTYPE = {
  "base": "./design/",
  "version": {
    "id": "D01",
    "label": "新华对接 D01 · 版本文档与原型",
    "baseline": "2026-11-02 当前源码副本；非已验证线上版本"
  },
  "data": {
    "project": "睿聆 WEC · 新华对接",
    "version": "D01",
    "generatedAt": "2026-11-02",
    "pages": [
      {
        "id": "DOC03",
        "title": "业务流程图",
        "type": "html",
        "url": "../document-viewer.html?doc=flows",
        "viewport": "PC",
        "requirements": [],
        "overview": "查看源文档中的业务流程与时序图。",
        "pageRole": "直接回显源 Markdown；源文件保存后自动同步。",
        "businessRules": [
          "只读展示，不在框架内维护另一份文档正文。"
        ],
        "states": [],
        "changes": []
      },
      {
        "id": "DOC04",
        "title": "接口数据对照",
        "type": "html",
        "url": "../document-viewer.html?doc=interfaces",
        "viewport": "PC",
        "requirements": [],
        "overview": "阅读字段与接口数据对照。",
        "pageRole": "直接回显源 Markdown；源文件保存后自动同步。",
        "businessRules": [
          "只读展示，不在框架内维护另一份文档正文。"
        ],
        "states": [],
        "changes": []
      },
      {
        "id": "DOC05",
        "title": "新华标准接口原文",
        "type": "html",
        "url": "../document-viewer.html?doc=standard",
        "viewport": "PC",
        "requirements": [],
        "overview": "阅读现有新华接口协议原文。",
        "pageRole": "直接回显源 Markdown；源文件保存后自动同步。",
        "businessRules": [
          "只读展示，不在框架内维护另一份文档正文。"
        ],
        "states": [],
        "changes": []
      },
      {
        "id": "DOC06",
        "title": "讨论确认记录",
        "type": "html",
        "url": "../document-viewer.html?doc=adr",
        "viewport": "PC",
        "requirements": [],
        "overview": "阅读本版本业务决定与待确认事项。",
        "pageRole": "直接回显源 Markdown；源文件保存后自动同步。",
        "businessRules": [
          "只读展示，不在框架内维护另一份文档正文。"
        ],
        "states": [],
        "changes": [],
        "hiddenInNavigation": true
      },
      {
        "id": "P02",
        "title": "项目备案字段配置",
        "type": "html",
        "url": "./pages/project-registration.html",
        "viewport": "PC",
        "requirements": [
          "P02-C01"
        ],
        "overview": "复刻编辑项目信息的基本信息页；备案字段下拉新增权益凭证ID。",
        "pageRole": "按用户截图复刻项目编辑弹窗，展示备案字段配置增量。",
        "businessRules": [
          "权益凭证ID用于用户唯一的备案号码。",
          "原有字段和默认已选项保留，新增字段可选择或取消。",
          "本页仅演示配置；不保存真实项目，不实现备案号码唯一性校验。"
        ],
        "requirementSources": [
          "本轮截图及用户要求；接口数据对照.md §7"
        ],
        "states": [
          {
            "id": "credential",
            "title": "查看权益凭证ID",
            "description": "展开下拉并滚动到新增字段。"
          },
          {
            "id": "selected",
            "title": "已选权益凭证ID",
            "description": "显示新增字段选中后的标签。"
          }
        ],
        "changes": [
          {
            "id": "P02-C01",
            "location": "基本信息 → 备案字段下拉",
            "action": "选择权益凭证ID",
            "result": "新增权益凭证ID选项，用作用户唯一的备案号码；支持勾选、取消及移除已选标签。",
            "stateId": "credential"
          }
        ]
      },
      {
        "id": "P03",
        "title": "会员项目权益ID",
        "type": "html",
        "url": "./pages/member-project-ids.html",
        "viewport": "PC",
        "requirements": [
          "P03-C01"
        ],
        "overview": "复刻会员编辑页，在会员基本信息中按项目只读展示接口同步的会员权益ID。",
        "pageRole": "一个会员可参与多个项目，分别展示项目与其会员权益ID的对应关系。",
        "businessRules": [
          "所属项目与会员权益ID由接口同步，只读展示，不提供下拉选择、编辑、添加或删除。",
          "同一会员可展示多个项目分别对应的权益ID。",
          "小字说明：用于标记会员在对应项目中的唯一ID标识。",
          "原型以本地演示数据模拟返回结果，不调用真实会员接口。"
        ],
        "requirementSources": [
          "本轮用户截图及说明；接口数据对照.md §8"
        ],
        "states": [
          {
            "id": "baseline",
            "title": "截图原布局",
            "description": "显示新增字段前的布局，用于截图对照；个人资料使用演示值。"
          },
          {
            "id": "multiple",
            "title": "多项目权益ID",
            "description": "同一会员展示两个不同项目与对应权益ID。"
          },
          {
            "id": "empty",
            "title": "暂无权益ID",
            "description": "接口未返回记录时显示暂无会员权益ID记录。"
          }
        ],
        "changes": [
          {
            "id": "P03-C01",
            "location": "会员基本信息 → 会员权益ID",
            "action": "查看接口同步的项目与会员权益ID",
            "result": "按项目只读展示会员权益ID及对应关系，不可手工添加、选择、编辑或删除。",
            "stateId": "multiple"
          }
        ]
      },
      {
        "id": "P04",
        "title": "绿通工单取消方",
        "type": "html",
        "url": "./pages/ticket-cancellation.html",
        "viewport": "PC",
        "requirements": [
          "P04-C01"
        ],
        "overview": "在绿通工单列表的工单状态后新增取消方，区分睿聆取消和客户平台接口取消。",
        "pageRole": "只读查看已取消工单的取消来源。",
        "businessRules": [
          "睿聆取消时，取消方显示睿聆。",
          "客户平台通过接口取消时，取消方显示该取消方对应的项目名称。",
          "取消方由取消来源确定，只读展示，不是操作入口；原型不执行真实取消。"
        ],
        "requirementSources": [
          "本轮用户截图及要求；接口数据对照.md §9"
        ],
        "states": [
          {
            "id": "local",
            "title": "睿聆取消",
            "description": "已取消工单的取消方为睿聆。"
          },
          {
            "id": "platform",
            "title": "客户平台接口取消",
            "description": "取消方显示接口取消方的项目名称，演示为新华保险测试项目。"
          }
        ],
        "changes": [
          {
            "id": "P04-C01",
            "location": "绿通工单列表 → 工单状态右侧",
            "action": "查看取消方",
            "result": "已取消后展示取消方；睿聆取消显示睿聆，接口取消显示取消方对应项目名称。"
          }
        ]
      }
    ]
  }
};
