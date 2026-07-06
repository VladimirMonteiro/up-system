import { Layout, Form, message, Pagination } from 'antd';
import { useEffect, useState } from 'react';

import { ToolsManagerHeader } from './components/ToolsManagerHeader';
import { ToolCard } from './components/ToolCard';
import { ToolForm } from './components/ToolForm';
import { useToolsManager } from '../../../hooks/useToolsManager';
import {
  CreateToolRequest,
  ToolResponse,
  UpdateToolRequest,
} from '../../../services/toolService/types';

const { Content } = Layout;

const PAGE_SIZE = 12;

export function ToolsManager() {
  /* =========================
     HOOK
  ========================== */
  const {
    tools,
    loading,
    page,
    totalPages,
    fetchTools,

    // filtros
    name,
    category,
    status,
    setName,
    setCategory,
    setStatus,

    // feedback
    success,
    error,
    setSuccess,
    setError,

    // ações
    createTool,
    updateTool,
    deleteTool,
  } = useToolsManager();

  /* =========================
     MODAL
  ========================== */
  const [open, setOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolResponse | null>(null);

  const [form] = Form.useForm<CreateToolRequest>();

  const openCreateModal = () => {
    setEditingTool(null);
    form.resetFields();
    setOpen(true);
  };

  const openEditModal = (tool: ToolResponse) => {
    setEditingTool(tool);

    // garante compatibilidade com o form
    form.setFieldsValue({
      ...tool,
    });

    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingTool(null);
  };

  /* =========================
     FEEDBACK UI
  ========================== */
  useEffect(() => {
    if (success) {
      message.success(success);
      setSuccess(null);
      closeModal();
    }
  }, [success, setSuccess]);

  useEffect(() => {
    if (error) {
      if (Array.isArray(error)) {
        error.forEach((e) => message.error(e));
      } else {
        message.error(error);
      }
      setError(null);
    }
  }, [error, setError]);

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async (values: CreateToolRequest) => {
    if (editingTool) {
      return await updateTool(editingTool.id, values as UpdateToolRequest);
    }
    return await createTool(values);
  };

  /* =========================
     PAGINAÇÃO
  ========================== */
  const handlePageChange = (pageNumber: number) => {
    // AntD começa em 1, backend em 0
    fetchTools(pageNumber - 1);
  };

  /* =========================
     RENDER
  ========================== */
  return (
    <>
      {/* HEADER */}
      <ToolsManagerHeader
        title='Ferramentas'
        description='Gerencie o catálogo de ferramentas'
        btnText='Cadastrar ferramenta'
        inputPlaceholder='Buscar por nome...'
        onAddClick={openCreateModal}
        searchValue={name}
        onSearchChange={setName}
        categoryFilter={category}
        onCategoryChange={setCategory}
        statusFilter={status}
        onStatusChange={setStatus}
      />

      {/* GRID */}
      <Content style={{ padding: 24 }}>
        <ToolCard tools={tools} loading={loading} onEdit={openEditModal} onDelete={deleteTool} />

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Pagination
              current={page + 1}
              total={totalPages * PAGE_SIZE} // fallback até ter totalElements
              pageSize={PAGE_SIZE}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </Content>

      {/* MODAL */}
      <ToolForm
        open={open}
        form={form}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingTool={editingTool}
      />
    </>
  );
}

export default ToolsManager;
